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
| GET / | 4.34 | 3.67 | -15.4% | 4.37 |
| GET /predict | 3.95 | 5.16 | +30.6% | 9.28 |
| POST /predict | 1.61 | 1.71 | +6.2% | 1.99 |
| GET /result/:id | 5.16 | 4.05 | -21.5% | 5.59 |
| GET /history | 4.65 | 5.7 | +22.6% | 11.44 |
| GET /stats | - | not available | - | - |

Phase 3: 2026-11-16T13:44:28.468Z (v24.21.0), Phase 4: 2026-11-17T09:13:40.948Z (v24.13.1)
