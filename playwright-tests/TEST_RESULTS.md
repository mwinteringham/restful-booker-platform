# Test results: latest run

Run on 2026-11-22 15:26 UTC, 106 seconds, Chromium, against http://localhost:3003.
Generated from `test-results.json` by `npm run report:summary`. The full interactive report is in `playwright-report/` (`npm run report`).

## Summary

| | Count |
|---|---|
| Tests run | 41 |
| Passed (behaviour works as expected) | 23 |
| Known defects (assert correct behaviour, fail as expected) | 18 |
| Unexpected failures | 0 |
| Flaky (passed on retry) | 0 |

No unexpected failures. Every red result below is a documented defect in [BUGS.md](BUGS.md).

## Known defects confirmed by this run

Each test asserts the correct behaviour and fails today. When a defect is fixed its test turns red until the `@known-defect` marker is removed.

| Test | Scenario | Bug | Why it fails |
|---|---|---|---|
| AT-18a | guest cannot list contact messages | API-01 | GET /api/message returns 200 without a token |
| AT-18b | guest cannot read a single message with name, email and phone | API-01 | GET /api/message/{id} returns personal data without a token |
| AT-19a | booking for a nonexistent room is refused | API-02 | returns 201 for roomid 99999 |
| AT-19b | booking dates in the past are refused | API-02 | returns 201 for dates in the past |
| AT-19c | a 20-year stay is refused | API-02 | returns 201 for a 20-year stay |
| AT-21 | a token stops working after logout | API-03 | the logout route is a stub, so the token stays valid |
| AT-05 | booking dates that are already taken shows a clear message | UI-01 | the page crashes ("This page couldn't load") instead of showing a message |
| AT-06 | /reservation/9999?checkin=2032-01-01&checkout=2032-01-03 shows a not-found message | UI-02 | the page crashes instead of showing a not-found message |
| AT-06 | /reservation/abc shows a not-found message | UI-02 | the page crashes instead of showing a not-found message |
| AT-07a | searching with dates in the past is not allowed | UI-04 | past dates are accepted and rooms are offered |
| AT-07b | check-out before check-in is not allowed | UI-04 | reversed dates are accepted and rooms are offered |
| AT-22 | the new-booking message tells the admin which room was booked | UI-08 | the message has the guest and dates but no room number or type |
| AT-16b | a saved B&B name shows on the public site within 10 seconds | UI-09 | /api/branding is cached for 60 seconds and the save does not clear it |
| AT-12 | a room created by admin is listed in admin and on the public site | UI-03 | the home page shows only the first three rooms (rooms.slice(0, 3)) |
| AT-14a | empty room form says what is missing | UI-07 | the only message is "Failed to create room" |
| AT-14b | a decimal price says what is wrong | UI-07 | the only message is "Failed to create room" |
| AT-23 | a room number that already exists cannot be created again | UI-10 | the duplicate room is created with no error |
| AT-15 | deleting a room that has a booking asks for confirmation | UI-06 | the room is deleted immediately, with no confirmation or warning |

## Passing tests

| Test | Scenario | Project | Time |
|---|---|---|---|
|  | log in as admin and save the session | setup | 1.5s |
| AT-18c | guest cannot read bookings, the report, or change rooms and branding | guest | 0.1s |
| AT-20 | overlapping dates are refused, back-to-back stays are allowed | guest | 0.5s |
| AT-19d | impossible and badly formatted dates are refused | guest | 0.4s |
| AT-10a | valid credentials open the rooms page (smoke) | guest | 1.9s |
| AT-10b | wrong password is rejected with a message | guest | 0.9s |
| AT-10c | empty username and password are rejected | guest | 1.0s |
| AT-11a | /admin/rooms shows the login form, not admin data (smoke) | guest | 0.9s |
| AT-11a | /admin/message shows the login form, not admin data (smoke) | guest | 0.9s |
| AT-11a | /admin/report shows the login form, not admin data (smoke) | guest | 1.1s |
| AT-11a | /admin/branding shows the login form, not admin data (smoke) | guest | 1.0s |
| AT-11b | after logging out, Back does not show admin data | guest | 1.4s |
| AT-02 | guest searches, books a room and sees the confirmation (smoke) | guest | 2.9s |
| AT-03 | price summary adds nights, cleaning fee and service fee | guest | 1.4s |
| AT-04 | empty guest form shows a message for every field | guest | 1.4s |
| AT-09a | empty form shows a message for every field | guest | 1.1s |
| AT-09b | values outside the allowed format and length are rejected | guest | 1.1s |
| AT-01 | home page loads with the three rooms and no errors (smoke) | guest | 1.1s |
| AT-08 | a guest contact message appears in admin, unread until opened (smoke) | admin | 3.0s |
| AT-17 | a guest booking appears on the admin report | admin | 1.8s |
| AT-16a | branding saves when only the B&B name is changed | admin | 1.8s |
| AT-13 | editing a room price and description persists | admin | 3.3s |
| AT-14c | price outside 1 to 999 is rejected | admin | 2.2s |

## Notes

- Known-defect tests use Playwright's `test.fail()`, so the suite is green while the defects exist. `SHOW_DEFECTS=1 npx playwright test --grep @known-defect` shows the real failure behind each.
- The setup step (admin login) is counted in the run and passes.
