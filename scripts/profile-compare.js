/**
 * Compares the Phase 3 baseline with the Phase 4 final profiling results and
 * writes profiling/comparison.md.
 *
 * Usage: node scripts/profile-compare.js   (needs the phase3-* and phase4-* .json files)
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'profiling');

function read(name) {
  const file = path.join(DIR, name);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${name}. Run: npm run profile:static -- --phase <phase> and npm run profile:dynamic -- --phase <phase>`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function change(before, after) {
  if (before === 0) {
    return after === 0 ? '0%' : 'n/a';
  }
  const percent = Math.round(((after - before) / before) * 1000) / 10;
  return `${percent > 0 ? '+' : ''}${percent}%`;
}

function main() {
  const staticBefore = read('phase3-static.json');
  const staticAfter = read('phase4-static.json');
  const dynamicBefore = read('phase3-dynamic.json');
  const dynamicAfter = read('phase4-dynamic.json');

  const lines = ['# Profiling comparison: Phase 3 baseline vs Phase 4 final', '', '## Static', '',
    '| Metric | Phase 3 | Phase 4 | Change |', '| --- | ---: | ---: | ---: |'];
  [['Files', staticBefore.files.length, staticAfter.files.length],
    ['Lines of code', staticBefore.totals.loc, staticAfter.totals.loc],
    ['Functions', staticBefore.totals.functions, staticAfter.totals.functions],
    ['Complexity (approx.)', staticBefore.totals.complexity, staticAfter.totals.complexity]
  ].forEach(([name, before, after]) => lines.push(`| ${name} | ${before} | ${after} | ${change(before, after)} |`));

  lines.push('', '## Dynamic (average response time)', '',
    '| Route | Phase 3 avg (ms) | Phase 4 avg (ms) | Change | Phase 4 p95 (ms) |', '| --- | ---: | ---: | ---: | ---: |');
  dynamicAfter.routes.forEach((after) => {
    const before = dynamicBefore.routes.find((route) => route.name === after.name);
    if (!after.available) {
      lines.push(`| ${after.name} | - | not available | - | - |`);
    } else if (!before || !before.available) {
      lines.push(`| ${after.name} | not available in Phase 3 | ${after.avg} | - | ${after.p95} |`);
    } else {
      lines.push(`| ${after.name} | ${before.avg} | ${after.avg} | ${change(before.avg, after.avg)} | ${after.p95} |`);
    }
  });
  lines.push('', `Phase 3: ${dynamicBefore.generatedAt} (${dynamicBefore.node}), Phase 4: ${dynamicAfter.generatedAt} (${dynamicAfter.node})`);

  fs.writeFileSync(path.join(DIR, 'comparison.md'), `${lines.join('\n')}\n`);
  console.log('Wrote profiling/comparison.md');
}

main();
