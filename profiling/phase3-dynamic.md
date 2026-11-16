# Dynamic profiling - phase3

- Generated: 2026-11-16T13:44:28.468Z
- Source commit: aa827608d620e14635227669b9dea82beef55053
- Machine: 13th Gen Intel(R) Core(TM) i5-13400F, win32, Node v24.21.0
- Mode: test login, Thai session, local fallback readings; no external API requests.
- Initial fixture: 1 reading; readings after sampling: 52.
- Requests per route: 50 (after 1 warm-up request)

| Route | Status | Avg (ms) | Min (ms) | Max (ms) | p95 (ms) | Heap change (KB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| GET / | 200 | 4.34 | 3.6 | 5.64 | 5.25 | 1273 |
| GET /predict | 200 | 3.95 | 3.31 | 5.39 | 4.79 | 2400 |
| POST /predict | 303 | 1.61 | 1.35 | 2.42 | 2.13 | 1561 |
| GET /result/:id | 200 | 5.16 | 3.48 | 15.54 | 12.69 | 1179 |
| GET /history | 200 | 4.65 | 3.88 | 6.62 | 5.58 | 12906 |
| GET /stats | 404 | not available yet | - | - | - | - |
