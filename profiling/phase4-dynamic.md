# Dynamic profiling - phase4

- Generated: 2026-11-17T09:13:40.948Z
- Source commit: 32f4a322a3b1d294b0c84bfee2f97621a667e9b6
- Machine: 13th Gen Intel(R) Core(TM) i7-13620H, win32, Node v24.13.1
- Mode: test login, Thai session, local fallback readings; no external API requests.
- Initial fixture: 1 reading; readings after sampling: 52.
- Requests per route: 50 (after 1 warm-up request)

| Route | Status | Avg (ms) | Min (ms) | Max (ms) | p95 (ms) | Heap change (KB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| GET / | 200 | 3.67 | 3.14 | 4.54 | 4.37 | 6071 |
| GET /predict | 200 | 5.16 | 3.08 | 16.83 | 9.28 | 748 |
| POST /predict | 303 | 1.71 | 1.44 | 2.32 | 1.99 | 859 |
| GET /result/:id | 200 | 4.05 | 3.13 | 12.24 | 5.59 | 167 |
| GET /history | 200 | 5.7 | 3.53 | 17.24 | 11.44 | 1800 |
| GET /stats | 404 | not available yet | - | - | - | - |
