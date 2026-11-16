const { Prediction } = require('../models/Prediction');

function predictionWithScores(scores) {
  const details = scores.map((score, index) => ({ title: `T${index}`, text: 'x', score }));
  return new Prediction('p1', 'u1', 'love', '1999-05-17', { level: 'high', headline: 'h', description: 'd', details, advice: 'a' });
}

describe('Prediction.luckyScore', () => {
  test('is the average of the detail scores', () => {
    expect(predictionWithScores([90, 80, 70]).luckyScore()).toBe(80);
  });

  test('is rounded to one decimal', () => {
    expect(predictionWithScores([88, 82, 90]).luckyScore()).toBe(86.7);
  });

  test('is 0 when there are no details', () => {
    expect(predictionWithScores([]).luckyScore()).toBe(0);
  });

  test('ignores details without a numeric score', () => {
    const prediction = predictionWithScores([60, 80]);
    prediction.result.details.push({ title: 'No score', text: 'x' });

    expect(prediction.luckyScore()).toBe(70);
  });

  test('is 0 when the result has no details at all', () => {
    const prediction = new Prediction('p2', 'u1', 'life', '1999-05-17', {});

    expect(prediction.luckyScore()).toBe(0);
  });
});
