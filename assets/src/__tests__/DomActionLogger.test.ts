import { readFileSync } from 'fs';
import { join } from 'path';

const source = readFileSync(join(__dirname, '../../public/dom-action-logger.js'), 'utf8');
const recorderWindow = window as Window & { domActionLogger?: { stop: () => void } };
const originalReplaceState = window.history.replaceState;

describe('DOM action logger', () => {
  let log: jest.SpyInstance;
  let fetchMock: jest.SpyInstance;
  let errorLog: jest.SpyInstance;
  let initialRecord: Record<string, unknown>;

  function records(action: string) {
    return log.mock.calls.map((call) => call[1].event).filter((record) => record.type === action);
  }

  function inputField(type = 'text') {
    const input = document.createElement('input');
    input.type = type;
    input.id = 'field';
    document.body.appendChild(input);
    return input;
  }

  function pointer(action: string, x = 0, y = 0, pointerType = 'mouse') {
    const event = new MouseEvent(action, { bubbles: true, clientX: x, clientY: y });
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      pointerType: { value: pointerType }
    });
    return event;
  }

  async function flushMutations() {
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(200);
  }

  beforeAll(() => {
    // jsdom does not provide the browser's CSS.escape implementation.
    Object.defineProperty(window, 'CSS', {
      configurable: true,
      value: { ...window.CSS, escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&') }
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
    window.history.replaceState({}, '', '/');
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock = jest.spyOn(window, 'fetch').mockResolvedValue({ ok: true, status: 201 } as Response);
    new Function(source)();
    initialRecord = log.mock.calls[0][1];
    log.mockClear();
  });

  afterEach(() => {
    recorderWindow.domActionLogger?.stop();
    document.body.innerHTML = '';
    log.mockRestore();
    fetchMock.mockRestore();
    errorLog.mockRestore();
    jest.useRealTimers();
  });

  it('records initial navigation and chronological, serialisable metadata', () => {
    const input = inputField();
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(initialRecord).toMatchObject({
      sessionId: expect.any(String),
      event: { type: 'navigation', sequence: 1, details: { source: 'initial' } }
    });
    const entries = log.mock.calls.map((call) => call[1].event);
    expect(entries.map((entry) => entry.sequence)).toEqual([2, 3]);
    expect(entries[0]).toMatchObject({
      timestamp: expect.any(String),
      elapsedMs: expect.any(Number),
      pageUrl: 'http://localhost/',
      interactionId: expect.any(Number)
    });
    expect(JSON.parse(JSON.stringify(entries[0]))).toEqual(entries[0]);
  });

  it.each(['focus', 'blur', 'click', 'input', 'change', 'submit', 'invalid', 'dblclick',
    'contextmenu', 'dragstart', 'drop', 'dragend', 'copy', 'cut', 'paste', 'toggle',
    'close', 'cancel'])('captures %s without preventing defaults or depending on bubbling', (action) => {
    const input = inputField();
    input.addEventListener(action, (event) => event.stopPropagation());
    const event = new Event(action, { bubbles: false, cancelable: true });

    expect(input.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    expect(records(action)).toHaveLength(1);
  });

  it('prefers test IDs, resolves labels, and falls back to unique structural locators', () => {
    document.body.innerHTML = '<label for="field">Subject</label><input id="field" data-testid="subject">' +
      '<button>Save</button><button>Save</button>';
    const input = document.querySelector('input')!;
    input.dispatchEvent(new Event('input'));

    expect(records('input')[0].target).toMatchObject({
      role: 'textbox', accessibleName: 'Subject',
      locator: { value: '[data-testid="subject"]', unique: true }
    });
    document.querySelectorAll('button')[1].click();
    const target = records('click')[0].target;
    expect(target).toMatchObject({ role: 'button', accessibleName: 'Save', locator: { fragile: true } });
    expect(document.querySelector(target.locator.value)).toBe(document.querySelectorAll('button')[1]);
  });

  it('identifies the owning control when a nested icon is clicked', () => {
    document.body.innerHTML = '<button id="save"><span>Save</span></button>';
    document.querySelector('span')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(records('click')[0].target.id).toBe('save');
  });

  it('groups a checkbox click/input/change as one interaction while retaining each event', () => {
    const checkbox = inputField('checkbox');
    checkbox.click();
    const entries = log.mock.calls.map((call) => call[1].event);
    expect(entries.map((entry) => entry.type)).toEqual(['click', 'input', 'change']);
    expect(new Set(entries.map((entry) => entry.interactionId)).size).toBe(1);
    expect(records('change')[0].details.state.checked).toBe(true);
    checkbox.click();
    expect(records('click')[1].interactionId).not.toBe(entries[0].interactionId);
  });

  it('groups repeated editing until blur and correlates keyboard submission with its form', () => {
    document.body.innerHTML = '<form><input id="field"><button type="submit">Save</button></form>';
    const input = document.querySelector('input')!;
    input.dispatchEvent(new Event('input'));
    jest.advanceTimersByTime(1000);
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    const edits = log.mock.calls.map((call) => call[1].event);
    expect(new Set(edits.map((entry) => entry.interactionId)).size).toBe(1);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const button = document.querySelector('button')!;
    document.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { submitter: button }));
    expect(records('submit')[0].interactionId).toBe(records('keydown')[0].interactionId);
    expect(records('submit')[0].details.submitter.accessibleName).toBe('Save');
  });

  it('captures meaningful keys and shortcuts but not ordinary typing or password shortcuts', () => {
    const input = inputField();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true }));
    input.type = 'password';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 's', altKey: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(records('keydown').map((record) => record.details.key)).toEqual(['Tab', 'v', 'Tab']);
  });

  it('redacts values by default and permanently redacts recognisable sensitive fields', () => {
    const input = inputField();
    input.value = 'private data';
    input.dispatchEvent(new Event('input'));
    expect(records('input')[0].details.state.value).toBe('[redacted]');
    input.setAttribute('data-dom-log-value', 'true');
    input.value = 'public test fixture';
    input.dispatchEvent(new Event('input'));
    expect(records('input')[1].details.state.value).toBe('public test fixture');
    for (const type of ['password', 'email', 'tel']) {
      input.type = type;
      input.value = 'private data';
      input.dispatchEvent(new Event('input'));
      expect(records('input').at(-1).details.state.value).toBe('[redacted]');
    }
    input.type = 'text';
    input.name = 'creditCard';
    input.dispatchEvent(new Event('input'));
    expect(records('input').at(-1).details.state.value).toBe('[redacted]');
    expect(JSON.stringify(log.mock.calls)).not.toContain('private data');
  });

  it('redacts private subtree metadata, clipboard contents, and file names', () => {
    document.body.innerHTML = '<div data-dom-log-private><button id="personal">Private person</button></div>';
    document.querySelector('button')!.click();
    expect(records('click')[0].target).toEqual({ tagName: 'BUTTON', redacted: true });
    const input = inputField('file');
    Object.defineProperty(input, 'files', { value: [new File(['private'], 'private-file.txt')] });
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('paste'));
    expect(records('change')[0].details.state.fileCount).toBe(1);
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/Private person|private-file/);
    expect(records('paste')[0].details).not.toHaveProperty('clipboardData');
  });

  it('excludes private descendants from control names and does not claim document locators for shadow DOM', () => {
    document.body.innerHTML = '<button>Save <span data-dom-log-private>private person</span></button><div id="host"></div>';
    document.querySelector('button')!.click();
    expect(records('click')[0].target.accessibleName).toBe('Save');
    const host = document.getElementById('host')!;
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<button id="field">Shadow button</button>';
    shadow.querySelector('button')!.dispatchEvent(new MouseEvent('click', { composed: true, bubbles: true }));
    expect(records('click')[1].target.locator.unique).toBe(false);
    host.setAttribute('data-dom-log-private', '');
    shadow.querySelector('button')!.dispatchEvent(new MouseEvent('click', { composed: true, bubbles: true }));
    expect(records('click')[2].target.redacted).toBe(true);
  });

  it('records selected indices and opt-in multi-select values', () => {
    document.body.innerHTML = '<select multiple data-dom-log-value="true">' +
      '<option value="single" selected>Single</option><option value="double" selected>Double</option></select>';
    document.querySelector('select')!.dispatchEvent(new Event('change'));
    expect(records('change')[0].details.state).toMatchObject({
      selectedIndices: [0, 1], selectedValues: ['single', 'double']
    });
  });

  it('filters hover movement inside a control and ignores touch hover', () => {
    document.body.innerHTML = '<button><span>Icon</span><span>Label</span></button>';
    const spans = document.querySelectorAll('span');
    spans[0].dispatchEvent(pointer('pointerover'));
    spans[1].dispatchEvent(new MouseEvent('pointerover', { bubbles: true, relatedTarget: spans[0] }));
    spans[0].dispatchEvent(pointer('pointerover', 0, 0, 'touch'));
    expect(records('pointerover')).toHaveLength(1);
    expect(records('pointerover')[0].target.tagName).toBe('BUTTON');
  });

  it('records pointer-based drag displacement and groups pointer/click events', () => {
    const input = inputField();
    input.dispatchEvent(pointer('pointerdown', 10, 20));
    input.dispatchEvent(pointer('pointerup', 50, 60));
    input.click();
    expect(records('pointerup')[0].details.drag).toMatchObject({ deltaX: 40, deltaY: 40 });
    expect(records('pointerup')[0].interactionId).toBe(records('pointerdown')[0].interactionId);
    expect(records('click')[0].interactionId).toBe(records('pointerdown')[0].interactionId);
  });

  it('groups native drag and drop across different elements without reading payloads', () => {
    const input = inputField();
    const destination = document.createElement('div');
    document.body.appendChild(destination);
    input.dispatchEvent(new Event('dragstart'));
    destination.dispatchEvent(new Event('drop'));
    input.dispatchEvent(new Event('dragend'));
    expect(records('drop')[0].interactionId).toBe(records('dragstart')[0].interactionId);
    expect(records('dragend')[0].interactionId).toBe(records('dragstart')[0].interactionId);
  });

  it('debounces container scrolling to its final position', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.scrollTop = 10;
    container.dispatchEvent(new Event('scroll'));
    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    jest.advanceTimersByTime(200);
    expect(records('scroll')).toHaveLength(1);
    expect(records('scroll')[0].details).toEqual({ x: 0, y: 50 });
  });

  it('records native validation reasons without copying the browser message or field value', () => {
    const input = inputField();
    input.required = true;
    expect(input.checkValidity()).toBe(false);
    expect(records('invalid')[0].details.validity.valueMissing).toBe(true);
    expect(records('invalid')[0].details).not.toHaveProperty('validationMessage');
  });

  it('tracks History API and browser navigation, redacts URLs, and deduplicates signals', () => {
    inputField().click();
    window.history.pushState({}, '', '/admin/rooms?token=private-token');
    window.history.replaceState({}, '', '/admin/messages');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.history.replaceState({}, '', '/#unknown-secret-fragment');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(records('navigation').map((record) => record.details.source)).toEqual([
      'pushState', 'replaceState', 'replaceState'
    ]);
    expect(records('navigation')[0].interactionId).toBe(records('click')[0].interactionId);
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/private-token|unknown-secret-fragment/);
    expect(() => window.history.pushState({}, '', 'https://different-origin.test/')).toThrow();
    expect(records('navigation')).toHaveLength(3);
  });

  it('records back/forward, known anchor changes, and back-forward-cache restoration', () => {
    document.body.innerHTML = '<section id="contact"></section>';
    originalReplaceState.call(window.history, {}, '', '/admin/rooms');
    window.dispatchEvent(new PopStateEvent('popstate'));
    originalReplaceState.call(window.history, {}, '', '/#contact');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    expect(records('navigation').map((record) => record.details.source)).toEqual([
      'popstate', 'hashchange', 'back-forward-cache'
    ]);
    expect(records('navigation')[1].pageUrl).toBe('http://localhost/#contact');
  });

  it('observes outcome appearance, text updates, hiding, and removal without logging text', async () => {
    inputField().click();
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = 'private validation message';
    document.body.appendChild(alert);
    await flushMutations();
    expect(records('outcome')[0]).toMatchObject({
      interactionId: records('click')[0].interactionId,
      details: { kind: 'appeared', observation: { text: '[redacted]', hidden: false } }
    });
    alert.textContent = 'other private validation message';
    await flushMutations();
    alert.hidden = true;
    await flushMutations();
    alert.remove();
    await flushMutations();
    expect(records('outcome').map((record) => record.details.kind)).toEqual([
      'appeared', 'updated', 'updated', 'disappeared'
    ]);
    expect(records('outcome')[2].details.observation.hidden).toBe(true);
    expect(JSON.stringify(log.mock.calls)).not.toContain('private validation message');
  });

  it('identifies declarative success outcomes and summarises other page changes', async () => {
    document.body.innerHTML = '<h3 data-dom-log-outcome="message-submitted">Thanks, private person!</h3>';
    await flushMutations();
    expect(records('outcome')[0].target.outcome).toBe('message-submitted');
    expect(records('content-change')[0].details.counts.added).toBe(1);
    expect(JSON.stringify(log.mock.calls)).not.toContain('private person');
  });

  it('observes dialog visibility changes caused by an ancestor', async () => {
    document.body.innerHTML = '<div hidden><div role="dialog">Private content</div></div>';
    await flushMutations();
    expect(records('outcome')[0].details.observation.hidden).toBe(true);
    document.querySelector('div')!.hidden = false;
    await flushMutations();
    expect(records('outcome')[1].details.observation.hidden).toBe(false);
  });

  it('does not install duplicate listeners and stops pending and future logging', async () => {
    new Function(source)();
    const input = inputField();
    input.click();
    input.dispatchEvent(new Event('scroll'));
    expect(records('click')).toHaveLength(1);
    const sentCount = fetchMock.mock.calls.length;
    recorderWindow.domActionLogger!.stop();
    log.mockClear();
    input.click();
    window.history.pushState({}, '', '/stopped');
    await flushMutations();
    expect(log).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(sentCount);
  });

  it('posts the service envelope for every record, including initial navigation', () => {
    const button = document.createElement('button');
    button.id = 'submit-button';
    document.body.appendChild(button);
    button.click();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, options] = fetchMock.mock.calls[1];
    expect(url).toBe('http://localhost:8080/event');
    expect(options).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      keepalive: true
    });
    const payload = JSON.parse(options.body);
    expect(payload).toEqual(log.mock.calls[0][1]);
    expect(payload).toMatchObject({
      sessionId: initialRecord.sessionId,
      event: {
        type: 'click', pageUrl: 'http://localhost/',
        target: { tagName: 'BUTTON', id: 'submit-button' }
      }
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(initialRecord);
    expect(payload.event).not.toHaveProperty('action');
    expect(payload.event).not.toHaveProperty('url');
  });

  it.each(['network', 'http'])('reports %s failures without interrupting interactions or retrying', async (failure) => {
    if (failure === 'network') {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    } else {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 503 } as Response);
    }
    const input = inputField();
    expect(() => input.click()).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();
    expect(errorLog).toHaveBeenCalledWith('[DOM action] Failed to send event', {
      sessionId: initialRecord.sessionId,
      sequence: 2,
      message: failure === 'network' ? 'Failed to fetch' : 'Event service returned HTTP 503'
    });
    input.dispatchEvent(new Event('input'));
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(records('input')).toHaveLength(1);
  });
});
