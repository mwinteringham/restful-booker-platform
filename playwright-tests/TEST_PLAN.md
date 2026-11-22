# Test Plan: Restful Booker Platform (Shady Meadows B&B)

**Target:** http://localhost:3003 (v2.2, run locally, Next.js dev mode)
**Tooling:** Playwright (`playwright-tests/`), Chromium
**Approach:** explore as a **guest** and as an **admin**, user interface first. API checks are used to confirm what the UI cannot show (access control, rules the UI should enforce), and are ranked after the UI findings.

Defects are written up in [BUGS.md](BUGS.md). Setup and run instructions are in [README.md](README.md).

## 1. Scope

| In scope | Out of scope |
|---|---|
| Guest: home, availability search, room page, reservation, contact form | Load and performance testing |
| Admin: login/logout, rooms, report, branding, messages | Penetration testing beyond basic probes |
| Data flowing between admin and the public site | Third-party map tile content |
| API checks that back up a UI risk | Exhaustive API contract testing |

Site map: `/` (hero, availability search, room cards, map, contact form), `/reservation/{id}?checkin=&checkout=` (room details, calendar, price summary, guest form, confirmation), `/admin` (login), `/admin/rooms`, `/admin/report`, `/admin/branding`, `/admin/message`.

## 2. Risk assessment

Risk = likelihood x impact, judged by what a real user would experience first. UI risks are listed first because that is where guests and staff meet the system; the API risks matter because every service can also be called directly.

| # | Risk | Where | Likelihood | Impact | Priority |
|---|---|---|---|---|---|
| R1 | The guest booking journey fails or confuses (wrong dates, conflicts, crashes) | UI | High | High | **Critical** |
| R2 | Guest-facing pages crash instead of showing a helpful message | UI | High | Medium | **High** |
| R3 | Data entered by admin does not reach the public site (rooms, branding) | UI | High | High | **High** |
| R4 | Date and price handling is wrong or unchecked (past or reversed dates, negative totals) | UI | High | Medium | **High** |
| R5 | Admin actions are destructive or unclear (delete without confirmation, vague errors) | UI | Medium | Medium | Medium |
| R6 | Authentication and access control can be bypassed or misused | UI + API | Medium | High | **High** |
| R7 | Guests' personal data is exposed | API | High | High | **Critical** |
| R8 | Stored script/markup input runs in the browser | UI | Low | High | Medium (tested, held up) |
| R9 | Accessibility and responsive layout | UI | Medium | Medium | Medium |

**Why this order**
- **Guest journey first (R1, R2, R4).** The booking flow is the product. A crash or a wrong price in front of a guest costs a booking, and these were cheap to reach through the UI.
- **Admin to public data flow (R3).** Admin changes only matter if guests see them. This is where a mismatch is most likely and least visible to staff.
- **Security (R6, R7).** Ranked critical or high because of impact (personal data, shared admin login), even though the evidence comes from the API. A guest should not be able to reach this data at all, whatever the UI shows.
- **Deliberately lighter:** cosmetic and content issues, and exhaustive input fuzzing. I chose fewer, deeper checks on R1 to R4 and R6 to R7 over broad shallow coverage.

## 3. Scenarios chosen (positive and negative)

Quality over quantity: a small set where each scenario has a clear reason. Positive scenarios prove the main flows work; negative scenarios cover the places where bad input or bad state caused real problems.

| Area | Positive | Negative | Why |
|---|---|---|---|
| Guest booking (R1, R4) | Search, reserve, see confirmation; price summary correct | Empty guest form; booking dates already taken; past, reversed or invalid dates | Core business flow, and the first place things went wrong |
| Guest error handling (R2) | Valid room page loads | Unknown, non-numeric and deleted room ids | Crashes here are the most visible defect to a guest |
| Contact form (R7, R8) | Valid message reaches admin with unread count | Empty, below/above limits, markup in fields | Public input that is stored and shown to staff |
| Admin rooms (R3, R5) | Create, edit, delete a room and see the effect publicly | Invalid price, empty form, delete a room that has bookings | Admin changes drive what guests can book |
| Admin branding (R3) | Update branding and see it on the public site | Invalid email, phone, coordinates | Only works if the form can be saved at all |
| Access and sessions (R6, R7) | Login; admin pages work when logged in | Wrong password; admin pages when logged out; token after logout; guest reading messages | A single shared admin login and directly reachable services |

Negative scenarios outnumber positive ones on purpose: the main flows are short and quick to confirm, and the defects were in what happens with bad input or an unexpected state.

## 4. Test cases

### 4.1 Automated (Playwright) - UI first

`P1` = run on every build, `K` = known defect (written to assert the correct behaviour, so it fails until fixed; tag `@known-defect`).

| ID | Type | Scenario | Expected | Risk | Notes |
|---|---|---|---|---|---|
| AT-01 | Positive | Home page loads | Title, heading, three room cards, no console errors | R1 | P1 smoke |
| AT-02 | Positive | Guest books a room: search, open room, enter details, reserve | "Booking Confirmed" with the chosen dates | R1 | P1 |
| AT-03 | Positive | Price summary for a 3-night stay | nights x rate + £25 cleaning + £15 service = shown total | R4 | |
| AT-04 | Negative | Reserve with an empty guest form | Field-level messages for first name, last name, email, phone | R1 | P1 |
| AT-05 | Negative | Book the same room and dates a second time | A clear "not available" message; page stays usable | R1 | **K: UI-01** |
| AT-06 | Negative | Open `/reservation/9999`, `/reservation/abc` | A not-found message, not a crashed page | R2 | **K: UI-02** |
| AT-07 | Negative | Search with a past date, or check-out before check-in | Rejected or corrected; no negative-night price | R4 | **K: UI-04** |
| AT-08 | Positive | Guest sends a valid contact message; admin opens Messages | Thanks message shown; admin sees it; unread count changes | R7 | P1 |
| AT-09 | Negative | Contact form: empty, bad email, short subject/message/phone | Specific message for each field | R7 | |
| AT-10 | Positive + negative | Admin login with valid and wrong credentials | Valid lands on Rooms; wrong shows "Invalid credentials" | R6 | P1 |
| AT-11 | Negative | Open admin pages logged out; log out then press Back | Login form; no admin data | R6 | P1 |
| AT-12 | Positive | Admin creates a room | Room appears in admin and on the public home page | R3 | **K: UI-03** |
| AT-13 | Positive | Admin edits a room price and description | Change persists after reload | R3 | |
| AT-14 | Negative | Admin creates a room with an empty form, price 99.99, "abc" | A message that says what is wrong | R5 | **K: UI-07** |
| AT-15 | Negative | Admin deletes a room that has a booking | Confirmation first; bookings handled; guest page for that room does not crash | R5 | **K: UI-06** |
| AT-16 | Positive | Admin updates a branding field | Saves (16a), and the public site shows the change within 10 seconds (16b) | R3 | **K: UI-05, UI-09** |
| AT-17 | Positive | Guest booking appears on the admin report | Booking visible on the right dates | R3 | |
| AT-22 | Negative | Open the admin "new booking" message after a guest booking | The message says which room was booked | R3 | **K: UI-08** |
| AT-23 | Negative | Admin creates a room using a room number that already exists | Rejected with a message; only one room with that number | R5 | **K: UI-10** |

### 4.2 Automated (Playwright API) - supporting

| ID | Type | Scenario | Expected | Risk | Notes |
|---|---|---|---|---|---|
| AT-18 | Negative | Guest requests `/api/message` and `/api/message/{id}` with no token | 401/403, no personal data | R7 | **K: API-01** |
| AT-19 | Negative | Booking API: nonexistent room, past dates, 20-year stay | 4xx for each | R1 | **K: API-02** |
| AT-20 | Positive + negative | Booking API: same dates twice, overlapping ranges, back-to-back | Overlap gives 409; back-to-back accepted | R1 | Held up |
| AT-21 | Negative | Log in, log out, validate the old token | Token no longer valid | R6 | **K: API-03** |

### 4.3 Manual (exploratory and judgement-based)

These need a human eye or are poor value to automate. Each is a short timed session (30 to 45 minutes) with a charter.

| ID | Charter | Look for |
|---|---|---|
| MT-01 | Explore the booking calendar as a first-time guest | Unclear unavailable days, selecting across a booked day or month boundary, wrong totals |
| MT-02 | Complete the booking and contact form with keyboard only; run NVDA/Narrator; check colour contrast | Focus order, labels, unannounced errors, contrast failures |
| MT-03 | Review home, room page and admin at 1920, 1280, 768 and 375 px | Overlap, clipped text, broken nav, horizontal scroll |
| MT-04 | Use the admin as a hotel manager: find unread messages, edit a room, change branding | Hard-to-find actions, missing confirmations, unclear states |
| MT-05 | Try unusual input in every form: emoji, very long text, spaces, pasted multi-line | Truncation, garbled text, layout breaking |
| MT-06 | Mid-booking: Back/Refresh, two tabs, double-click Reserve | Duplicate bookings, lost data, stale availability |

## 5. Findings

Full detail, steps and expected behaviour are in [BUGS.md](BUGS.md). UI findings come first. Severity is my judgement.

### UI findings

| ID | Severity | Finding |
|---|---|---|
| UI-01 | High | Booking dates that are already taken crash the page ("This page couldn't load") instead of showing a message |
| UI-02 | High | Room page for an unknown, non-numeric or deleted room id crashes the same way |
| UI-03 | High | The home page shows only the first three available rooms, so rooms added by admin are hidden unless earlier rooms are booked for the dates searched |
| UI-04 | Medium | Past, reversed and invalid dates are accepted and flow into the room page, which shows negative totals ("£100 x -4 nights, £-400") or "NaN" |
| UI-05 | Medium | Branding cannot be saved as shipped: the seeded logo URL fails the form's own validation, so any edit is rejected |
| UI-06 | Medium | Deleting a room has no confirmation, works even when it has bookings, and then guests hit a crashed page for that room |
| UI-07 | Low | Admin room errors are vague: "Failed to create room" or "Failed to update room" for price 99.99, text, 0 or an empty form; other messages have no field name |
| UI-08 | Medium | The "new booking" message sent to the admin gives the guest and dates but not which room was booked |
| UI-09 | Low | Branding changes take up to a minute to show on the public site (cached for 60 seconds, not cleared on save) |
| UI-10 | Medium | The admin page lets you create a second room with an existing room number |

### API findings (supporting)

| ID | Severity | Finding |
|---|---|---|
| API-01 | High | Guests can read every contact message, including name, email and phone, without logging in |
| API-02 | Medium | Booking API accepts a nonexistent room, past dates and a 20-year stay |
| API-03 | Medium | Logout does not invalidate the token on the server, and the auth cookie is not `HttpOnly` |
| API-04 | Medium | No rate limiting or lockout on login |
| API-05 | Medium | Several error cases return 500 instead of 4xx; room creation accepts unknown features and duplicate names |

### What held up

- Double-booking is blocked for overlapping ranges (exact, inside, enclosing); back-to-back stays are allowed.
- Booking confirmation shows the correct dates, and a guest booking creates an admin notification message.
- Contact and reservation form validation shows clear, field-specific messages.
- Script and markup typed into the contact form, booking names and room names is shown as text; nothing ran in the browser.
- Login failures give one generic message; admin pages and write APIs reject users who are not logged in.

## 6. Test data and environment

- Default admin login: `admin` / `password`.
- The services use in-memory databases, so restarting them restores seed data. `build_locally.cmd` also runs the Java e2e suite, which adds a few rooms and messages of its own.
- Use far-future dates in tests to avoid collisions, and delete rooms, bookings and messages a test creates.
- This was tested on a development build (Next.js overlay visible). Behaviour on a production build was not compared.

## 7. Automation approach

- Playwright `@playwright/test`, Chromium, page objects per area (home, reservation, admin).
- Admin login once in a global setup and reuse `storageState`.
- Use API calls to create and remove data, and the UI for the behaviour under test.
- Order of work: P1 smoke (AT-01, 02, 04, 08, 10, 11), then known-defect tests, then the rest.

## 8. Not covered yet

- Calendar interaction in depth (drag selection, month boundaries): left to MT-01.
- Two simultaneous bookings for the same dates (race condition).
- Contact content pages (`/cookie`, `/privacy`): not verified.
- Firefox and WebKit, accessibility scanning, production build.

## 9. Exit criteria

All P1 cases pass; every known defect is either fixed or accepted with a note; no critical or high defect remains open.
