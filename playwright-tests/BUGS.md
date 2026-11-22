# Bug report

Found while testing the Restful Booker Platform (local build, v2.2) as a guest and as an admin. UI defects are listed first, then API defects that back up a UI risk.

Severity is my judgement: **High** = a guest or admin hits a broken journey, or personal data is exposed; **Medium** = wrong behaviour with a workaround or limited reach; **Low** = unclear or untidy behaviour.

| ID | Severity | Title |
|---|---|---|
| UI-01 | High | Booking dates that are already taken crash the page |
| UI-02 | High | Room page crashes for an unknown, non-numeric or deleted room |
| UI-03 | High | The public site lists at most three rooms, so rooms added by admin are usually hidden |
| UI-04 | Medium | Past, reversed and invalid dates are accepted and produce negative or NaN totals |
| UI-05 | Medium | Branding cannot be saved as shipped |
| UI-06 | Medium | Room delete has no confirmation and breaks the guest page when bookings exist |
| UI-07 | Low | Admin room errors are vague |
| UI-08 | Medium | The "new booking" message sent to the admin does not say which room was booked |
| UI-09 | Low | Branding changes take up to a minute to show on the public site |
| UI-10 | Medium | The admin page lets you create a second room with an existing room number |
| API-01 | High | Guests can read all contact messages, including personal details |
| API-02 | Medium | Booking API accepts a nonexistent room, past dates and a 20-year stay |
| API-03 | Medium | Logout does not invalidate the token; auth cookie is not `HttpOnly` |
| API-04 | Medium | No rate limiting or lockout on login |
| API-05 | Medium | Error cases return 500; room creation accepts unknown features and duplicate names |

All steps assume the app is running at http://localhost:3003.

---

## UI defects

### UI-01 (High): Booking dates that are already taken crash the page

**Steps**
1. Open `http://localhost:3003/reservation/3?checkin=2028-03-10&checkout=2028-03-12`.
2. Click **Reserve Now**, fill in first name, last name, email and phone, click **Reserve Now**. The booking is confirmed.
3. Open the same URL again and book it a second time with different guest details.

**Actual:** the page is replaced by "This page couldn't load. Reload to try again, or go back." The browser console shows an uncaught `TypeError` (`Cannot read properties of undefined (reading 'length')`) and the booking API has returned 409.
**Expected:** a message such as "These dates are no longer available", with the form still usable so the guest can pick other dates.
**Impact:** two guests competing for the same room is a normal situation; the loser sees a broken page and cannot tell what happened.

### UI-02 (High): Room page crashes for an unknown, non-numeric or deleted room

**Steps:** open each of these:
- `http://localhost:3003/reservation/9999?checkin=2027-01-01&checkout=2027-01-03`
- `http://localhost:3003/reservation/abc`
- the reservation URL of a room an admin has just deleted (see UI-06)

**Actual:** "This page couldn't load. Reload to try again, or go back." with a console `TypeError` (`reading 'map'`). The page returns HTTP 200.
**Expected:** a not-found message with a link back to the rooms. A missing page should be a 404.

### UI-03 (High): The public site lists at most three rooms, so rooms added by admin are usually hidden

**Steps**
1. Log in at `/admin` with `admin` / `password`.
2. On **Rooms**, create a room (for example name `QA1`, price `80`, tick TV) and click **Create**. It shows in the admin table.
3. Open the home page and look at **Our Rooms**.

**Actual:** only three rooms are shown (Single, Double, Suite). The new room is not listed, so guests cannot find or book it. The API returns every room (`GET /api/room`), so the data is there. The cause is in `assets/src/components/home/Availability.tsx:102`: `rooms.slice(0, 3)`. The new room only appears when enough earlier rooms are already booked for the dates searched: with rooms 1 and 2 booked for a date range, a search for those dates returned rooms 3, 4 and 6, so room 6 then shows. That is why a new room can look fine when other rooms are booked and be invisible otherwise.
**Expected:** every available room is shown (or the limit is a deliberate, visible feature such as paging or a "show more" link).
**Impact:** the admin cannot reliably add sellable rooms, and which rooms guests see depends on what else is booked.

### UI-04 (Medium): Past, reversed and invalid dates are accepted and give negative or NaN totals

**Steps**
1. On the home page set **Check In** to `01/01/2020` and **Check Out** to `03/01/2020`, click **Check Availability**. All three rooms are offered.
2. Set **Check In** `12/12/2027` and **Check Out** `10/12/2027` (before check-in), click **Check Availability**. All rooms are still offered, and the links carry `checkin=2027-12-12&checkout=2027-12-10`.
3. Open `http://localhost:3003/reservation/1?checkin=2027-01-05&checkout=2027-01-01`.
4. Open `http://localhost:3003/reservation/1?checkin=garbage&checkout=garbage`.

**Actual:** step 3 shows "£100 x -4 nights, £-400"; step 4 shows "£100 x NaN nights, £NaN". Past dates give a normal price (2 nights, £200).
**Expected:** the date pickers should not allow past dates or a check-out on or before check-in; the room page should reject invalid dates before showing a price.

### UI-05 (Medium): Branding cannot be saved as shipped

**Steps**
1. Log in, open **Branding**.
2. Change only the **Name** (or change nothing) and click **Submit**.

**Note:** this happens on a freshly started instance. If a valid logo URL has already been saved, later saves work.

**Actual:** "Url should be a correct url format". The seeded **Logo** value is `/images/rbp-logo.jpg`, which the form's own validation rejects, so no change can be saved until the logo is replaced with an absolute URL (for example `http://localhost:3003/images/rbp-logo.jpg`); after that the save works and shows a success message.
**Expected:** the seeded value passes validation, or the validation accepts relative paths, or the error names the Logo field.
**Impact:** an admin changing a phone number or address is blocked by an unrelated, unlabelled field.

### UI-06 (Medium): Room delete has no confirmation and breaks the guest page when bookings exist

**Steps**
1. Create a room in admin and make a booking for it (use the room's reservation page).
2. On **Rooms**, click the delete (x) icon on that room's row.
3. Open the room's reservation URL.

**Actual:** the room disappears immediately with no confirmation and no warning that it has bookings. The room's reservation page then crashes (UI-02). Through the API the room's bookings are still returned for that room id, and `GET /api/room/{id}` returns 500.
**Expected:** a confirmation step that mentions existing bookings, and either blocking the delete or handling the bookings; a deleted room should be a clean "not found".

### UI-07 (Low): Admin room errors are vague

**Steps:** on **Rooms**, click **Create** with the form empty; then try price `99.99`, `abc`, `-5`, `100000`; then edit a room and set the price to `0` and click **Update**.

**Actual:**
- empty form, `99.99` and `abc` all show only "Failed to create room"
- `-5` shows "must be greater than or equal to 1" and `100000` shows "must be less than or equal to 999" (no field name)
- editing the price to `0` shows "Failed to update room"

**Expected:** messages that name the field and the rule, as the contact and reservation forms do (for example "Room name must be set", "Price must be a whole number between 1 and 999").

### UI-08 (Medium): The "new booking" message sent to the admin does not say which room was booked

**Steps**
1. As a guest, book any room (for example `http://localhost:3003/reservation/1?checkin=2032-05-10&checkout=2032-05-12`).
2. Log in as admin and open **Messages**. A message "You have a new booking!" has arrived (unread count goes up).
3. Open the message.

**Actual:** the body reads "You have a new booking from {guest}. They have booked a room for the following dates: 2032-05-10 to 2032-05-12", with the guest's email and phone. It does not say which room (number, type or price). The cause is `booking/src/main/java/com/automationintesting/service/MessageBuilder.java`, which builds the text from the guest and dates only.
**Expected:** the message names the room (for example "Room 101, Single"), so the admin can act on it without searching the report.
**Impact:** with several rooms and bookings, the admin has to cross-check the Report page to find out what was booked.

### UI-09 (Low): Branding changes take up to a minute to show on the public site

**Steps**
1. Log in, open **Branding**, change the **Name**, and save (see UI-05 for a save that works).
2. Open the home page in another browser or private window, and reload every few seconds.

**Actual:** the old name is shown for up to about a minute. `GET /api/branding` returns the old value while the branding service itself already has the new one. `assets/src/app/api/branding/route.ts` fetches with `revalidate: 60` and the `PUT` handler never clears that cache; the admin form also loads branding with `cache: 'force-cache'` (`Branding.tsx:35`), so it can show old values too.
**Expected:** a saved change is visible straight away (clear the cached branding when the `PUT` succeeds).

### UI-10 (Medium): The admin page lets you create a second room with an existing room number

**Steps**
1. Log in, open **Rooms**, and note an existing room number (for example `101`).
2. In the create form enter the same room number (`101`), a price (for example `90`), and click **Create**.
3. Repeat if you like: every click adds another room.

**Actual:** no error. A second room `101` appears in the table, and both show up in `GET /api/room`. The room list now has two rows with the same number, with different prices if you chose a different one, and nothing tells staff which is the real one. Running the Java e2e suite that `build_locally.cmd` starts also leaves duplicates (two `103` rooms on my instance).
**Expected:** the form rejects a room number that already exists, with a message such as "Room number 101 already exists". The same rule should apply in the API (see API-05).
**Impact:** room numbers are how staff and the report identify a room (the report shows "Name - Room: 103"), so duplicates make bookings ambiguous.

---

## API defects (supporting)

The API is reachable directly, so these affect guests even though the UI never shows them. Use this login to get a token for the steps that need one:

```bash
TOK=$(curl -s -X POST http://localhost:3003/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')
```

### API-01 (High): Guests can read all contact messages, including personal details

**Steps (no login)**
1. `curl http://localhost:3003/api/message`
2. `curl http://localhost:3003/api/message/1`

**Actual:** both return 200. The list shows every sender and subject; the detail call returns name, email, phone and the full text, for example `{"description":"I would like to book a room at your place","email":"james@email.com","messageid":1,"name":"James Dean","phone":"01402 619211","subject":"Booking enquiry"}`.
**Expected:** 401 or 403 without an admin token. The admin Messages page requires login; the API behind it does not. Ids are sequential, so every message can be collected.

### API-02 (Medium): Booking API accepts a nonexistent room, past dates and a 20-year stay

**Steps:** `POST http://localhost:3003/api/booking` with this body, changing `roomid` and the dates:

```bash
curl -i -X POST http://localhost:3003/api/booking -H 'Content-Type: application/json' \
  -d '{"roomid":9999,"firstname":"Testy","lastname":"Guestly","depositpaid":false,"email":"t@e.com","phone":"01234567890","bookingdates":{"checkin":"2027-07-01","checkout":"2027-07-03"}}'
```

**Actual:** 201 Created for `roomid` 9999 (no such room), for dates in 2020, and for `2030-01-01` to `2050-01-01` (which leaves the room unavailable for 20 years in the public `GET /api/report/room/{id}`).
**Expected:** 4xx for a room that does not exist, dates in the past, and an unreasonable stay length.

### API-03 (Medium): Logout does not invalidate the token; the auth cookie is not `HttpOnly`

**Steps:** log in and keep the token; log out through the admin UI; then
`curl -X POST http://localhost:3003/api/auth/validate -H 'Content-Type: application/json' -d "{\"token\":\"$TOK\"}"`

**Actual:** `{"valid":true}`. In the code, `assets/src/components/admin/Nav.tsx` calls `/api/auth/logout` without sending the token, and `assets/src/app/api/auth/logout/route.ts` is a stub (its comment says "Here you would typically handle the actual logout logic") that returns success without calling the auth service. Logout only removes the cookie in the browser. The `token` cookie also has `HttpOnly` false and `Secure` false.
**Expected:** the token is deleted on the server at logout, and the cookie is `HttpOnly` (and `Secure` over HTTPS).

### API-04 (Medium): No rate limiting or lockout on login

**Steps:** send 10 wrong passwords to `POST /api/auth/login`, then the correct one.
**Actual:** each wrong attempt returns 401 as normal and the correct login then succeeds.
**Expected:** throttling or a temporary lockout. With one shared admin account and a published default password this is the main attack.

### API-05 (Medium): Error cases return 500; room creation accepts invalid values

**Steps and actual**
- `GET /api/message/999999` returns 500 (expected 404).
- `POST /api/room` with `Cookie: token=garbage` returns 500 (expected 401).
- `POST /api/room` with a 500-character `roomName` returns 500 (expected 400).
- `GET /api/room/{id of a deleted room}` returns 500 (expected 404).
- `POST /api/room` with a feature `"Jacuzzi"` or a `roomName` that already exists returns 200 and stores it.

**Expected:** client mistakes give 4xx with a helpful message; features come from the offered list and room names are unique.

---

## Checked, not a defect

- The Next.js development overlay and "stale version" notice appear because the app runs in dev mode.
- Double-booking is blocked for overlapping dates, and back-to-back stays are allowed.
- Script and markup typed into the contact form, booking names and room names are shown as text and do not run.
