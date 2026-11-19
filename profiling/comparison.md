# Profiling comparison: Phase 3 baseline vs Phase 4 final

## Static

| Metric | Phase 3 | Phase 4 | Change |
| --- | ---: | ---: | ---: |
| Files | 24 | 24 | 0% |
| Lines of code | 809 | 850 | +5.1% |
| Functions | 80 | 90 | +12.5% |
| Complexity (approx.) | 158 | 166 | +5.1% |

## Dynamic (average response time)

| Route | Phase 3 avg (ms) | Phase 4 avg (ms) | Change | Phase 4 p95 (ms) |
| --- | ---: | ---: | ---: | ---: |
| GET / | 12.45 | 12.39 | -0.5% | 18.17 |
| GET /predict | 11.78 | 10.87 | -7.7% | 13.65 |
| POST /predict | 4.67 | 4.73 | +1.3% | 6.71 |
| GET /result/:id | 13.47 | 11.21 | -16.8% | 14.63 |
| GET /history | 20.98 | 16.59 | -20.9% | 20.72 |

Phase 3: 2026-11-19T14:01:20.907Z (v24.18.0), Phase 4: 2026-11-19T14:01:24.757Z (v24.18.0)
