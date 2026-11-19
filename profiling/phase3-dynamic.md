# Dynamic profiling - phase3

- Generated: 2026-11-19T14:01:20.907Z
- Source commit: 0834805ea68d05ff97f975e86165529a1b19b861
- Machine: 13th Gen Intel(R) Core(TM) i5-13420H, win32, Node v24.18.0
- Mode: test login, Thai session, local fallback readings; no external API requests.
- Initial fixture: 1 reading; readings after sampling: 52.
- Requests per route: 50 (after 1 warm-up request)

| Route | Status | Avg (ms) | Min (ms) | Max (ms) | p95 (ms) | Heap change (KB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| GET / | 200 | 12.45 | 8.46 | 23.46 | 17.81 | 1698 |
| GET /predict | 200 | 11.78 | 8.72 | 17.82 | 13.78 | 2878 |
| POST /predict | 303 | 4.67 | 3.37 | 10.83 | 6.93 | 1384 |
| GET /result/:id | 200 | 13.47 | 8.36 | 24.09 | 20.2 | -3711 |
| GET /history | 200 | 20.98 | 13.38 | 53.58 | 41.95 | 2851 |
