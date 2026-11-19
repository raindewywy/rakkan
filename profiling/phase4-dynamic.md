# Dynamic profiling - phase4

- Generated: 2026-11-19T14:01:24.757Z
- Source commit: 075f11a029bfa0939af953d73655e7be0addc86f
- Machine: 13th Gen Intel(R) Core(TM) i5-13420H, win32, Node v24.18.0
- Mode: test login, Thai session, local fallback readings; no external API requests.
- Initial fixture: 1 reading; readings after sampling: 52.
- Requests per route: 50 (after 1 warm-up request)

| Route | Status | Avg (ms) | Min (ms) | Max (ms) | p95 (ms) | Heap change (KB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| GET / | 200 | 12.39 | 8.45 | 21.28 | 18.17 | 1718 |
| GET /predict | 200 | 10.87 | 8.03 | 15.12 | 13.65 | 2812 |
| POST /predict | 303 | 4.73 | 3.64 | 7.04 | 6.71 | 1455 |
| GET /result/:id | 200 | 11.21 | 8.12 | 18.73 | 14.63 | -3065 |
| GET /history | 200 | 16.59 | 10.73 | 22.64 | 20.72 | 3268 |
