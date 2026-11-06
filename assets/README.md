# Restful-booker-assets

The assets API is responsible for serving the UI assets to a browser to give users easy access to the restful-booker-platform.

## Building and running

To run the assets service first run ```npm install``` before running ```npm run dev``` to start up the service in development mode. Please note the UI will fail if dependent APIs aren't running.

## Running checks

Run ```npm test``` to run the unit checks for this service.

## Interaction recording

`public/dom-action-logger.js` is a standalone script loaded before hydration by
the shared root layout on all public and admin pages. Browser console records
use the `[DOM action]` prefix and the service envelope `{ sessionId, event }`.
`event` contains `type`, `pageUrl`, `target` (with uppercase `tagName`), sequence,
timestamp, elapsed time, interaction ID, and event details. The session ID is
shared by all events within a document; a full-page load starts a new session.
Enable **Preserve log** in browser developer tools to retain records across
full-page navigation.

Each record is also sent as a JSON POST to `http://localhost:8080/event` using
`fetch` with `keepalive` enabled to allow delivery during navigation where the
browser permits it. The browser supplies the `Origin` header; the event service
must allow the UI origin (for example `http://localhost:3003`), POST, and the
`Content-Type` header through CORS, including OPTIONS preflight requests.
Requests omit credentials. Network and non-success HTTP responses are reported
with the session ID and sequence in the console; there are no automatic retries
or durable client-side queues. Delivery is best-effort, and the service should
use sequence numbers rather than arrival order to reconstruct interactions.
`localhost` refers to the visitor's machine; deployments on HTTPS require an
appropriate HTTPS endpoint rather than this local development URL.

The recorder captures:

- Focus, blur, click, input, change, submit, and native validation (`invalid`).
- Meaningful key presses and shortcuts (not ordinary typed characters),
  double-click, right-click, and clipboard actions (not clipboard contents).
- Pointer hover transitions on controls, native drag-and-drop, pointer
  down/up/cancel (with drag displacement for custom dragging), and debounced
  page/container scrolling.
- Initial navigation, History API navigation (including Next.js client routes),
  back/forward, hash changes, and restoration from the back/forward cache.
- Dialog/disclosure events; appearance, updates, and disappearance of alerts,
  statuses, live regions, dialogs, tooltips, Bootstrap alerts, and validation feedback.
  Other DOM changes produce debounced counts, not full HTML or text dumps.
  Message-submitted and booking-confirmed headings have declarative
  `data-dom-log-outcome` markers so those successes can be identified without
  recording their personalised text. The same attribute can mark other outcomes.

Capture-phase listeners handle dynamically rendered elements and stopped
bubbling without preventing default actions. Related click/input/change and
keyboard/submission records share an interaction ID where possible; individual
events are retained. Outcome correlation refers to the most recent interaction
and is a heuristic, not proof of causality for asynchronous updates.

Target metadata includes a best-effort accessible role/name and a unique test-ID,
ID, or name-based CSS locator where available. Structural fallback locators are
marked fragile. Accessible names are not a complete accessibility-tree
implementation and may contain displayed user data.

Field values and outcome text are redacted by default. Add
`data-dom-log-value="true"` to an individual non-sensitive field to opt into its
value recording. Password, credential, payment, and recognisable personal-data
fields remain redacted even with this attribute. File names/content are never
recorded; selected option indices, checkbox/radio state, and file counts are.
Mark a sensitive subtree with `data-dom-log-private` to redact its target
metadata and state as well. URL query values and non-element fragments are
redacted. Review console logs before sharing them: field-name detection cannot
identify every kind of sensitive content in an opted-in field or control label.

Call `window.domActionLogger.stop()` in the console to remove listeners,
disconnect observation, and cancel pending records for the current document.
Already-sent requests are not aborted.
The recorder observes the top-level document, not iframe contents or mutations
inside shadow roots. Events reaching the document from open shadow roots are
recorded, but their locators are marked non-unique rather than claiming that a
document-level selector can reach them. Pointer displacement indicates movement,
not proof that a custom widget accepted a drag.
