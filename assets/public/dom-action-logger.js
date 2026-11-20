(function () {
  if (window.domActionLogger) return;

  var sequence = 0;
  var interaction = 0;
  var lastInteraction = null;
  var active = true;
  var dragInteraction = null;
  var listeners = [];
  var sessionId = Array.from(window.crypto.getRandomValues(new Uint32Array(4))).map(function (part) {
    return part.toString(16).padStart(8, '0');
  }).join('-');
  var meaningfulKeys = ['Enter', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft',
    'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Delete', 'Backspace', ' '];
  var controlSelector = 'button,a[href],input,select,textarea,[role],[tabindex],[draggable="true"],[data-testid]';

  function listen(target, action, callback) {
    target.addEventListener(action, callback, { capture: true, passive: true });
    listeners.push(function () { target.removeEventListener(action, callback, true); });
  }

  function privateTarget(target) {
    while (target) {
      if (target.closest('[data-dom-log-private]')) return true;
      var root = target.getRootNode();
      target = root instanceof ShadowRoot ? root.host : null;
    }
    return false;
  }

  function text(value) {
    return value.replace(/\s+/g, ' ').trim().slice(0, 160);
  }

  function publicText(target) {
    if (privateTarget(target) || target.matches('input,textarea,script,style,[contenteditable="true"]')) return '';
    return Array.from(target.childNodes).map(function (node) {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      return node instanceof Element ? publicText(node) : '';
    }).join('');
  }

  function role(target) {
    if (target.getAttribute('role')) return target.getAttribute('role');
    var tag = target.tagName.toLowerCase();
    if (tag === 'button') return 'button';
    if (tag === 'a' && target.hasAttribute('href')) return 'link';
    if (tag === 'textarea') return 'textbox';
    if (tag === 'select') return target.multiple ? 'listbox' : 'combobox';
    if (tag === 'input') {
      if (['checkbox', 'radio', 'range'].includes(target.type)) {
        return { checkbox: 'checkbox', radio: 'radio', range: 'slider' }[target.type];
      }
      if (['submit', 'button', 'reset'].includes(target.type)) return 'button';
      if (!['hidden', 'password', 'file'].includes(target.type)) return 'textbox';
    }
    return null;
  }

  function accessibleName(target) {
    if (privateTarget(target)) return '[redacted]';
    var labelledBy = target.getAttribute('aria-labelledby');
    if (labelledBy) {
      return text(labelledBy.split(/\s+/).map(function (id) {
        var label = document.getElementById(id);
        return label ? publicText(label) : '';
      }).join(' '));
    }
    if (target.hasAttribute('aria-label')) return text(target.getAttribute('aria-label'));
    if (target.labels && target.labels.length) {
      return text(Array.from(target.labels).map(function (label) {
        return publicText(label);
      }).join(' '));
    }
    if (['button', 'link', 'option', 'menuitem', 'tab'].includes(role(target))) {
      return text(publicText(target));
    }
    return target.getAttribute('alt') || null;
  }

  function locator(target) {
    var testId = target.getAttribute('data-testid');
    var candidates = [];
    if (testId) candidates.push('[data-testid="' + CSS.escape(testId) + '"]');
    if (target.id) candidates.push('#' + CSS.escape(target.id));
    if (target.getAttribute('name')) {
      candidates.push(target.tagName.toLowerCase() + '[name="' + CSS.escape(target.getAttribute('name')) + '"]');
    }
    for (var candidate of candidates) {
      var matches = document.querySelectorAll(candidate);
      if (matches.length === 1 && matches[0] === target) {
        return { strategy: 'css', value: candidate, unique: true };
      }
    }
    var parts = [];
    var node = target;
    while (node && node.nodeType === 1) {
      var index = 1;
      var sibling = node.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === node.tagName) index++;
        sibling = sibling.previousElementSibling;
      }
      parts.unshift(node.tagName.toLowerCase() + ':nth-of-type(' + index + ')');
      node = node.parentElement;
    }
    var selector = parts.join(' > ');
    var matches = document.querySelectorAll(selector);
    return { strategy: 'css', value: selector, unique: matches.length === 1 && matches[0] === target, fragile: true };
  }

  function describe(target) {
    if (!(target instanceof Element)) return null;
    if (privateTarget(target)) return { tagName: target.tagName, redacted: true };
    return {
      tagName: target.tagName,
      id: target.id,
      name: target.getAttribute('name'),
      type: target.getAttribute('type'),
      role: role(target),
      accessibleName: accessibleName(target),
      locator: locator(target)
    };
  }

  function valuesAllowed(target) {
    var identity = [target.id, target.getAttribute('name'), target.getAttribute('autocomplete'),
      target.getAttribute('type'), target.getAttribute('placeholder'), accessibleName(target)].join(' ');
    return !privateTarget(target) &&
      target.getAttribute('data-dom-log-value') === 'true' &&
      !/password|secret|token|credit|card|cc-|cvc|cvv|email|tel|phone|address|name|message|description|one-time-code/i.test(identity);
  }

  function state(target) {
    var result = {};
    if (!(target instanceof Element) || privateTarget(target)) return result;
    if ('disabled' in target) result.disabled = target.disabled;
    if ('required' in target) result.required = target.required;
    if ('readOnly' in target) result.readOnly = target.readOnly;
    if (target.matches('input[type="checkbox"],input[type="radio"]')) result.checked = target.checked;
    ['aria-expanded', 'aria-selected', 'aria-pressed', 'aria-invalid'].forEach(function (attribute) {
      if (target.hasAttribute(attribute)) result[attribute] = target.getAttribute(attribute);
    });
    if (target.matches('input,textarea,select,[contenteditable="true"]')) {
      result.value = valuesAllowed(target) ?
        (target.matches('[contenteditable="true"]') ? target.textContent : target.value) : '[redacted]';
    }
    if (target.matches('select')) {
      result.selectedIndices = Array.from(target.options).reduce(function (indices, option, index) {
        if (option.selected) indices.push(index);
        return indices;
      }, []);
      if (valuesAllowed(target)) {
        result.selectedValues = Array.from(target.selectedOptions).map(function (option) { return option.value; });
      }
    }
    if (target.matches('input[type="file"]')) {
      result.fileCount = target.files ? target.files.length : 0;
      result.value = '[redacted]';
    }
    return result;
  }

  function safeUrl(href) {
    var url = new URL(href || window.location.href, window.location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return '[non-http-url]';
    Array.from(url.searchParams.keys()).forEach(function (key) {
      url.searchParams.set(key, '[redacted]');
    });
    if (url.hash && !document.getElementById(url.hash.slice(1))) url.hash = '[redacted]';
    return url.origin + url.pathname + url.search + url.hash;
  }

  function emit(action, target, details, interactionId) {
    if (!active) return;
    var payload = {
      sessionId: sessionId,
      event: {
        type: action,
        pageUrl: safeUrl(),
        target: describe(target),
        sequence: ++sequence,
        timestamp: new Date().toISOString(),
        interactionId: interactionId || null,
        details: details
      }
    };
    console.log('[DOM action]', payload);
    window.fetch('http://localhost:8080/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      keepalive: true,
      body: JSON.stringify(payload)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Event service returned HTTP ' + response.status);
      }
    }).catch(function (error) {
      console.error('[DOM action] Failed to send event', {
        sessionId: sessionId,
        sequence: payload.event.sequence,
        message: error instanceof Error ? error.message : String(error)
      });
    });
  }

  function correlate(action, target) {
    var now = performance.now();
    var previous = lastInteraction;
    var sameTarget = previous && previous.target === target;
    var related = sameTarget && (
      (action === 'input' && ['input', 'change'].includes(previous.action)) ||
      (now - previous.time < 750 && (
        ['change', 'input', 'blur', 'dblclick'].includes(action) ||
        (action === 'click' && previous.action === 'keydown') ||
        (action === 'submit' && ['click', 'keydown'].includes(previous.action))
      ))
    );
    if (action === 'submit' && previous && now - previous.time < 750 &&
        target instanceof HTMLFormElement && target.contains(previous.target)) related = true;
    lastInteraction = {
      id: related ? previous.id : ++interaction,
      target: target,
      action: action,
      time: now
    };
    return lastInteraction.id;
  }

  function eventTarget(event) {
    var target = event.composedPath()[0];
    return target instanceof Element ? target : null;
  }

  function logAction(event) {
    var target = eventTarget(event);
    if (!target) return;
    if (['click', 'dblclick', 'contextmenu', 'keydown'].includes(event.type)) {
      target = target.closest(controlSelector) || target;
    }
    if (event.type === 'keydown') {
      var shortcut = event.ctrlKey || event.metaKey || event.altKey;
      if (!meaningfulKeys.includes(event.key) && !shortcut) return;
      if (privateTarget(target)) return;
      if (target.matches('input[type="password"]') && !meaningfulKeys.includes(event.key)) return;
    }
    var details = { state: state(target), isTrusted: event.isTrusted };
    if (event.type === 'input') {
      details.inputType = event.inputType || null;
      details.isComposing = event.isComposing || false;
    }
    if (event.type === 'keydown') {
      details.key = event.key;
      details.modifiers = { alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey, shift: event.shiftKey };
      details.repeat = event.repeat;
    }
    if (['click', 'dblclick', 'contextmenu'].includes(event.type)) {
      details.button = event.button;
      details.clickCount = event.detail;
      details.modifiers = { alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey, shift: event.shiftKey };
      if (target.matches('a[href]') && !privateTarget(target)) details.destination = safeUrl(target.getAttribute('href'));
    }
    if (event.type === 'submit') {
      details.submitter = describe(event.submitter);
      if (target instanceof HTMLFormElement && !privateTarget(target)) {
        details.method = target.method;
        details.destination = safeUrl(target.action);
      }
    }
    if (event.type === 'invalid' && target.validity && !privateTarget(target)) {
      details.validity = {};
      ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooLong', 'tooShort',
        'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput', 'customError'].forEach(function (key) {
        details.validity[key] = target.validity[key];
      });
    }
    var id = correlate(event.type, target);
    if (event.type === 'dragstart') dragInteraction = id;
    if (['dragstart', 'drop', 'dragend'].includes(event.type)) {
      id = dragInteraction || id;
      if (event.dataTransfer) {
        details.dataTypes = Array.from(event.dataTransfer.types);
        details.dropEffect = event.dataTransfer.dropEffect;
        details.effectAllowed = event.dataTransfer.effectAllowed;
      }
      if (event.type === 'dragend') dragInteraction = null;
    }
    lastInteraction.id = id;
    emit(event.type, target, details, id);
  }

  var lastUrl = window.location.href;
  function navigation(source) {
    if (lastUrl === window.location.href) return;
    lastUrl = window.location.href;
    emit('navigation', null, { source: source }, lastInteraction && lastInteraction.id);
  }
  ['pushState', 'replaceState'].forEach(function (method) {
    var original = window.history[method];
    function wrapped() {
      var result = original.apply(this, arguments);
      navigation(method);
      return result;
    }
    window.history[method] = wrapped;
    listeners.push(function () {
      if (window.history[method] === wrapped) window.history[method] = original;
    });
  });
  listen(window, 'popstate', function () { navigation('popstate'); });
  listen(window, 'hashchange', function () { navigation('hashchange'); });
  listen(window, 'pageshow', function (event) {
    if (event.persisted) emit('navigation', null, { source: 'back-forward-cache' }, null);
  });

  ['focus', 'blur', 'click', 'input', 'change', 'submit', 'invalid', 'keydown',
    'dblclick', 'contextmenu', 'dragstart', 'drop', 'dragend', 'copy', 'cut', 'paste',
    'toggle', 'close', 'cancel'].forEach(function (action) {
    listen(document, action, logAction);
  });

  window.domActionLogger = {
    stop: function () {
      active = false;
      listeners.forEach(function (remove) { remove(); });
      delete window.domActionLogger;
    }
  };
  emit('navigation', null, { source: 'initial' }, null);
})();
