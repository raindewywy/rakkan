/**
 * Dynamic profiling: response time and heap growth of the main routes.
 * The app runs inside this process (through supertest), so no server needs to be started.
 *
 * Usage: node scripts/profile-dynamic.js [--phase phase3] [--runs 50]
 * With --phase the result is written to profiling/<phase>-dynamic.md and .json.
 */
process.env.NODE_ENV = 'test';
process.env.E2E = '1'; // enables the test-only login used to get a session
process.env.COOKIE_SECURE = 'false';
process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';
process.env.HOROSCOPE_API_URL = '';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { performance } = require('perf_hooks');
const request = require('supertest');
const app = require('../app');
const { sharedHistory } = require('../models/PredictionHistory');

const ROOT = path.join(__dirname, '..');
const ROUTES = [
  { name: 'GET /', method: 'get', url: '/', expectedStatus: 200 },
  { name: 'GET /predict', method: 'get', url: '/predict', expectedStatus: 200 },
  { name: 'POST /predict', method: 'post', url: '/predict', expectedStatus: 303, form: { category: 'love', day: '17', month: '5', year: '1999' } },
  { name: 'GET /result/:id', method: 'get', url: '/result/:id', expectedStatus: 200 },
  { name: 'GET /history', method: 'get', url: '/history', expectedStatus: 200 }
];

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return fallback;
  }
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function sourceCommit() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch (err) {
    return null;
  }
}

/** Sends one request of a route with the logged in agent. */
function send(agent, route) {
  const req = agent[route.method](route.url).timeout({ response: 10000, deadline: 15000 });
  return route.form ? req.type('form').send(route.form) : req;
}

/** Percentile of a sorted array of numbers. */
function percentile(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

async function measure(agent, route, runs) {
  const first = await send(agent, route);
  if (first.statusCode === 404 && route.optional) {
    return { name: route.name, status: 404, available: false };
  }
  if (first.statusCode !== route.expectedStatus) {
    throw new Error(`${route.name}: expected HTTP ${route.expectedStatus}, got ${first.statusCode}`);
  }
  const times = [];
  if (global.gc) {
    global.gc();
  }
  const heapBefore = process.memoryUsage().heapUsed;
  for (let i = 0; i < runs; i += 1) {
    const start = performance.now();
    // eslint-disable-next-line no-await-in-loop
    const response = await send(agent, route);
    const elapsed = performance.now() - start;
    if (response.statusCode !== route.expectedStatus) {
      throw new Error(`${route.name}: request ${i + 1} returned HTTP ${response.statusCode}`);
    }
    times.push(elapsed);
  }
  const heapKB = Math.round((process.memoryUsage().heapUsed - heapBefore) / 1024);
  const sorted = [...times].sort((a, b) => a - b);
  const round = (n) => Math.round(n * 100) / 100;
  return {
    name: route.name,
    status: first.statusCode,
    available: true,
    runs,
    avg: round(times.reduce((sum, t) => sum + t, 0) / times.length),
    min: round(sorted[0]),
    max: round(sorted[sorted.length - 1]),
    p95: round(percentile(sorted, 95)),
    heapKB
  };
}

function toMarkdown(phase, runs, rows, context) {
  const lines = [
    `# Dynamic profiling${phase ? ` - ${phase}` : ''}`,
    '',
    `- Generated: ${context.generatedAt}`,
    `- Source commit: ${context.sourceCommit || 'unavailable'}`,
    `- Machine: ${context.cpu}, ${context.platform}, Node ${context.node}`,
    '- Mode: test login, Thai session, local fallback readings; no external API requests.',
    `- Initial fixture: 1 reading; readings after sampling: ${context.finalReadings}.`,
    `- Requests per route: ${runs} (after 1 warm-up request)`,
    '',
    '| Route | Status | Avg (ms) | Min (ms) | Max (ms) | p95 (ms) | Heap change (KB) |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |'
  ];
  rows.forEach((row) => {
    lines.push(
      row.available
        ? `| ${row.name} | ${row.status} | ${row.avg} | ${row.min} | ${row.max} | ${row.p95} | ${row.heapKB} |`
        : `| ${row.name} | ${row.status} | not available yet | - | - | - | - |`
    );
  });
  return `${lines.join('\n')}\n`;
}

async function main() {
  const phase = argValue('--phase', '');
  const runs = Number(argValue('--runs', '50'));
  if (phase && !/^[a-z0-9][a-z0-9_-]*$/i.test(phase)) {
    throw new Error('--phase requires a simple label such as phase3 or phase4');
  }
  if (!Number.isInteger(runs) || runs < 1) {
    throw new Error('--runs must be a positive integer');
  }

  const agent = request.agent(app);
  await agent.post('/auth/test-login').type('form').send({ name: 'Profiler', email: 'profiler@example.com' }).expect(302);
  await agent.get('/history').expect(200);
  await agent.get('/lang/th').expect(302);
  const fixture = await send(agent, ROUTES.find((route) => route.method === 'post')).expect(303);
  if (!fixture.headers.location || !fixture.headers.location.startsWith('/result/')) {
    throw new Error('POST /predict did not create a result URL');
  }
  const routes = ROUTES.map((route) => route.url === '/result/:id'
    ? { ...route, url: fixture.headers.location }
    : route);

  const rows = [];
  for (const route of routes) {
    // eslint-disable-next-line no-await-in-loop
    rows.push(await measure(agent, route, runs));
  }
  const context = {
    generatedAt: new Date().toISOString(),
    sourceCommit: sourceCommit(),
    node: process.version,
    cpu: os.cpus()[0] ? os.cpus()[0].model : 'unavailable',
    platform: os.platform(),
    apiMode: 'local',
    language: 'th',
    initialReadings: 1,
    finalReadings: sharedHistory.getAll('test-profiler@example.com').length
  };
  const markdown = toMarkdown(phase, runs, rows, context);

  if (!phase) {
    process.stdout.write(markdown);
    return;
  }
  const outDir = path.join(ROOT, 'profiling');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${phase}-dynamic.md`), markdown);
  fs.writeFileSync(
    path.join(outDir, `${phase}-dynamic.json`),
    `${JSON.stringify({ phase, ...context, runs, routes: rows }, null, 2)}\n`
  );
  console.log(`Wrote profiling/${phase}-dynamic.md and .json`);
}

main().then(() => process.exit(0), (err) => {
  console.error(err);
  process.exit(1);
});
