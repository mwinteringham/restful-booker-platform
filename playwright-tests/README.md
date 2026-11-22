# Playwright tests for Restful Booker Platform

Automated checks and test documentation for the Shady Meadows B&B booking platform, written as a guest and as an admin.

| Document | What it contains |
|---|---|
| [TEST_PLAN.md](TEST_PLAN.md) | Risk assessment, positive and negative scenarios and why they were prioritised, automated and manual test cases, findings |
| [BUGS.md](BUGS.md) | Defect reports: steps, actual result, expected result |
| `tests/` | Playwright tests |

## Prerequisites

The platform itself needs (from the repository root README):

- JDK 26
- Maven 3.9.14
- Node and npm (the platform README lists Node 24.14.1 / npm 11.11.0; I ran it with Node 26.13.1 / npm 11.20.0 without problems)

The Playwright project only needs Node 18 or newer and npm.

## Setup from a clean start

1. **Build and start the platform.** From the repository root:
   - Windows: `build_locally.cmd`
   - Mac/Linux: `bash build_locally.sh`

   The first run downloads dependencies and takes a while. When it finishes, the site is at http://localhost:3003 and the APIs listen on ports 3000 to 3006. Later, use `run_locally.cmd` or `run_locally.sh` to start it without rebuilding.

   **If http://localhost:3003 does not load:** the Java services may be up while the front end is not. On my machine the first `npm run dev` that `run_locally.cmd` starts stopped right after printing "Ready" and a Next.js upgrade reminder, so port 3003 was never opened. Fix: leave the script's terminal running, open a second terminal and run:
   ```
   cd assets
   npm run dev
   ```
   The second run continues normally and serves the site on port 3003. To check, run `netstat -ano | findstr :3003` (Windows) or open http://localhost:3003. Pressing Enter in the `run_locally` terminal stops all Java and Node processes, so keep it open while testing.

2. **Install the test project.** In a second terminal:
   ```
   cd playwright-tests
   npm install
   npx playwright install chromium
   ```

## Running the tests

Make sure the platform is running first.

```
npm test                       # run all tests, headless
npx playwright test --headed   # watch the browser
npx playwright test --grep @smoke        # the quick smoke pack
npx playwright test --project=guest    # guest, login and API tests only
SHOW_DEFECTS=1 npx playwright test --grep @known-defect   # show the real failures behind the known defects
npx playwright show-report     # open the HTML report from the last run
```

## Reports

After a run:

- **Interactive report:** `npm run report` opens the HTML report (`playwright-report/`) with steps, screenshots and traces for failures.
- **Written summary:** `npm run report:summary` turns the run's `test-results.json` into [TEST_RESULTS.md](TEST_RESULTS.md): counts, each known defect with its bug id and reason, and the passing tests. The copy in this folder is from the latest run.

Run `npm test` without a `--reporter` option, because that option replaces the HTML and JSON reporters the report needs.

To point at a different address: `BASE_URL=http://host:port npx playwright test` (PowerShell: `$env:BASE_URL="http://host:port"; npx playwright test`).

## Test scenarios and approach

See [TEST_PLAN.md](TEST_PLAN.md). In short: the platform was tested as a guest and as an admin, risks were ranked by likelihood and impact, and the deepest testing went to the areas where a failure would expose personal data or corrupt bookings (access control, booking rules, input validation, sessions, room/booking consistency). The plan lists positive and negative scenarios per area and splits the test cases into those suited to automation and those better done manually.

## Defects found

Fifteen are written up in [BUGS.md](BUGS.md): ten in the UI and five in the API. The most serious are:

- booking dates that are already taken crash the page instead of showing a message (UI-01)
- the room page crashes for an unknown or deleted room (UI-02)
- the public home page shows only the first three available rooms, so rooms an admin adds are usually hidden (UI-03)
- guests can read every contact message, with names, emails and phone numbers, without logging in (API-01)

## Assumptions

- The platform runs locally on the default ports, and nothing else is using ports 3000 to 3006.
- The default admin login is used (`admin` / `password`, from the platform README).
- The application data is a local, disposable instance (in-memory databases that reset when the services restart). Some tests create rooms, bookings and messages, so run them against a throwaway instance, not shared data.
- Dates used for bookings in tests are far in the future so they do not collide with seed data.

## Known limitations

- **Known-defect tests pass by design.** Tests tagged `@known-defect` assert the correct behaviour and are marked with Playwright's `test.fail()`, so they show as expected failures (`x`) while the defect exists and turn red once it is fixed. Use `SHOW_DEFECTS=1` to see the actual failure for each. Each one names its bug id (UI-01 and so on).
- **Automation covers the main flows only.** 41 tests run: guest booking, contact form, admin login, rooms, messages, report, branding and API checks. The manual cases (MT-01 to MT-06) in the test plan are not automated.
- **Chromium only.** Firefox and WebKit are not configured.
- **Dev-mode build.** I tested a build that runs Next.js in development mode (an overlay and stale-version notice were visible). Behaviour on a production build was not compared.
- **Not covered yet:** the calendar in depth, two simultaneous bookings for the same dates, the Cookie and Privacy pages, load and performance, and accessibility scanning. These are listed under "Not covered yet" in the test plan.
- **Node version.** Tested on Node 26, not the Node 24 version named in the platform README.
- **Test data.** `build_locally.cmd` also runs the Java e2e suite, which adds a few rooms and messages of its own. The services use in-memory H2 databases, so restarting them restores the original seed data.
