# Static profiling - phase3

- Generated: 2026-11-16T13:44:26.667Z
- Source commit: aa827608d620e14635227669b9dea82beef55053
- Node: v24.21.0
- Function counts and complexity are regex estimates, not AST measurements.

| File | LOC | Functions (approx.) | Complexity (approx.) |
| --- | ---: | ---: | ---: |
| app.js | 33 | 4 | 6 |
| server.js | 5 | 1 | 2 |
| config/env.js | 19 | 0 | 8 |
| config/passport.js | 17 | 4 | 4 |
| config/session.js | 15 | 1 | 1 |
| controllers/historyController.js | 32 | 4 | 6 |
| controllers/homeController.js | 13 | 1 | 2 |
| controllers/predictController.js | 80 | 5 | 13 |
| middleware/requireLogin.js | 7 | 2 | 3 |
| models/Prediction.js | 35 | 2 | 2 |
| models/PredictionHistory.js | 63 | 14 | 14 |
| models/User.js | 49 | 7 | 14 |
| routes/auth.js | 49 | 7 | 7 |
| routes/history.js | 7 | 0 | 1 |
| routes/home.js | 5 | 0 | 1 |
| routes/lang.js | 19 | 1 | 5 |
| routes/predict.js | 8 | 0 | 1 |
| services/birthDateValidator.js | 65 | 5 | 26 |
| services/horoscopeClient.js | 34 | 5 | 11 |
| services/localReadings.js | 106 | 1 | 6 |
| services/predictor.js | 44 | 6 | 6 |
| services/readingData.js | 47 | 3 | 6 |
| services/zodiac.js | 25 | 2 | 5 |
| public/js/birthdate.js | 32 | 5 | 8 |
| **Total (24 files)** | **809** | **80** | **158** |
