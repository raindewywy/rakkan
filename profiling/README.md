# Profiling guide

## Recorded baseline and its limits

The `phase3-*.md` and `phase3-*.json` files are real measurements captured on
**19 November 2026**, after the planned 9 November checkpoint. The `phase3`
filename is the ticket's baseline label; these are not historical measurements
from 9 November. The baseline and the final capture were both re-run on the same
machine with the same Node version (24.18.0), a few seconds apart, so that the
comparison no longer mixes machines or Node versions. The profiling scripts were
copied from main into the baseline checkout, because commit `0834805` predates them.

The application source comes from main commit `0834805`, which already includes
T10, T11, T16, T19 and T20. Each report records the exact measured checkout in
`sourceCommit`, the actual capture timestamp in `generatedAt`, and the Node version.
The dynamic report also records the CPU, platform, inputs and resulting dataset size.

This late baseline can be compared with subsequent changes using the same method.
It cannot establish the performance difference between a pure Phase 3 application
and all Phase 4 work. Keep that limitation in the final report.

## Commands used for the baseline

Run from the repository root with Node 24 and dependencies from the lockfile:

```bash
npm ci
npm test
npm run profile:static -- --phase phase3
npm run profile:dynamic -- --phase phase3
```

The scripts generate both Markdown and JSON. Do not edit measured numbers by hand.
For a later capture, use `--phase phase4` or a new label instead of overwriting the
committed baseline. A label may contain letters, digits, hyphens and underscores.

## Static measurements

The static script scans `app.js`, `server.js`, and JavaScript files recursively in
`config`, `controllers`, `middleware`, `models`, `routes`, `services`, and `public/js`.
It excludes tests, dependencies, profiling scripts, CSS and EJS templates.

- LOC counts nonblank lines after heuristic comment removal.
- Functions are a regex estimate of declarations, arrows and methods.
- Complexity is a file-level estimate: one plus decision tokens such as `if`,
  `for`, `while`, `case`, `catch`, `&&`, `||`, `??` and ternaries.

These are text heuristics, not AST analysis or per-function McCabe complexity.
Strings and unusual syntax can affect the counts. Use the same script for both
captures, and treat the values as indicators rather than exact semantic counts.

## Dynamic measurements

The dynamic script starts the exported Express application inside its own process
and sends HTTP requests with Supertest. It enables test login and nonsecure local
cookies for this process, disables Google credentials and the external horoscope
API, and uses the local fallback readings in a Thai session. It does not change
`.env` or the state of a separately running application.

Each process starts with a fresh in-memory store. One successful prediction creates
the result fixture before timing. Then each route receives one warm-up request and
50 measured requests, sequentially, in the order shown in the table. Prediction
inputs are `category=love`, `day=17`, `month=5`, `year=1999`.

The measured POST returns HTTP 303; that measurement does not follow its redirect.
The result page is timed separately using the fixture's URL. POST warm-up and
samples add 51 more readings, so the later history measurement contains 52 readings.
Other users' records are not seeded.

The report gives average, minimum, maximum and nearest-rank p95 response time in
milliseconds, plus the net change in `heapUsed` in KB during each route's batch.
Heap changes can be negative because of garbage collection. They are not peak
memory usage and do not establish a memory leak.

The baseline used the default Node flags, without forced garbage collection.
Keep Node flags, machine, input, language, request count and route order the same
when comparing captures. Desktop workload and garbage collection add noise, so
small differences in a single run should not be reported as proven improvements.

There is no separate statistics page in the final scope, so `GET /stats` is not
measured; the home-page statistics are included in `GET /`. Every timed response
must return its expected status; a failed login, unexpected redirect, server error
or timeout aborts capture.

Run-to-run noise is large on a desktop machine. In repeated alternating runs on
19 November the average of one route moved by 20% or more between runs, and the very
first run after a long idle period was about twice as slow as later ones. Differences
between Phase 3 and Phase 4 of this size are therefore not proven improvements or
regressions; describe them as "no clear change" in the report.

The current results describe local HTTP rendering and fallback prediction only.
They do not measure Google login, internet API latency, browser rendering or AWS.

## Comparing the final capture

```bash
npm run profile:static -- --phase phase4
npm run profile:dynamic -- --phase phase4
```

Use `--runs 50` for the same sampling size. Another positive integer is supported,
but comparisons must keep that setting consistent. Copy generated tables into the
report together with capture dates, source commits and the late-baseline limitation.
If an optional route becomes available, describe it as new coverage rather than a
speed improvement over its previous 404.
