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
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
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

  it('records focus and clicks but does not log or send raw pointer and hover events', () => {
    const input = inputField();
    fetchMock.mockClear();
    input.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
    input.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(log).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();

    input.focus();
    input.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    input.click();
    input.dispatchEvent(new MouseEvent('pointerout', { bubbles: true }));
    input.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));

    expect(document.activeElement).toBe(input);
    expect(log.mock.calls.map((call) => call[1].event.type)).toEqual(['focus', 'click']);
    expect(fetchMock.mock.calls.map((call) => JSON.parse(call[1].body).event.type)).toEqual(['focus', 'click']);
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

  it('does not log or send page or container scroll events', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await flushMutations();
    log.mockClear();
    fetchMock.mockClear();

    document.dispatchEvent(new Event('scroll'));
    container.dispatchEvent(new Event('scroll'));
    jest.advanceTimersByTime(200);

    expect(log).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
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

  it('does not log or send DOM changes, even after an interaction', async () => {
    inputField().click();
    expect(records('click')).toHaveLength(1);
    log.mockClear();
    fetchMock.mockClear();

    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = 'Validation message';
    document.body.appendChild(alert);
    await flushMutations();
    alert.firstChild!.textContent = 'Updated validation message';
    alert.hidden = true;
    await flushMutations();
    alert.remove();
    await flushMutations();

    expect(log).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not report existing alerts when the logger starts', () => {
    recorderWindow.domActionLogger!.stop();
    document.body.innerHTML = '<div role="alert">Validation message</div>';
    fetchMock.mockClear();
    new Function(source)();

    expect(log.mock.calls.map((call) => call[1].event.type)).toEqual(['navigation']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not install duplicate listeners and stops future logging', () => {
    new Function(source)();
    const input = inputField();
    input.click();
    expect(records('click')).toHaveLength(1);
    const sentCount = fetchMock.mock.calls.length;
    recorderWindow.domActionLogger!.stop();
    log.mockClear();
    input.click();
    window.history.pushState({}, '', '/stopped');
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
    expect(payload.event).not.toHaveProperty('elapsedMs');
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
