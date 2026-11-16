/**
 * Static profiling: lines of code, number of functions and an approximate
 * cyclomatic complexity for every source file of the app.
 *
 * Usage: node scripts/profile-static.js [--phase phase3]
 * With --phase the result is written to profiling/<phase>-static.md and .json.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SOURCE_FILES = ['app.js', 'server.js'];
const SOURCE_DIRS = ['config', 'controllers', 'middleware', 'models', 'routes', 'services', 'public/js'];
const KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return']);

/** Lists the .js files of the app (tests and node_modules are not part of the product code). */
function listSourceFiles() {
  const files = SOURCE_FILES.filter((file) => fs.existsSync(path.join(ROOT, file)));
  function visit(dir) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) {
      return;
    }
    fs.readdirSync(full, { withFileTypes: true })
      .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
      .forEach((entry) => {
        const relative = `${dir}/${entry.name}`;
        if (entry.isDirectory()) {
          visit(relative);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          files.push(relative);
        }
      });
  }
  SOURCE_DIRS.forEach(visit);
  return files;
}

/** Identifies the measured checkout without exposing Git configuration. */
function sourceCommit() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch (err) {
    return null;
  }
}

/** Removes comments so they do not count as code. */
function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

/** Counts lines of code, functions and approximate cyclomatic complexity of one file. */
function analyse(relativePath) {
  const code = stripComments(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
  const loc = code.split(/\r?\n/).filter((line) => line.trim() !== '').length;

  const arrowsAndFunctions = (code.match(/\bfunction\b|=>/g) || []).length;
  const methods = (code.match(/^\s+(?:async\s+|static\s+)*([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/gm) || []).filter((line) => {
    const name = /([A-Za-z_$][\w$]*)\s*\(/.exec(line)[1];
    return !KEYWORDS.has(name);
  }).length;

  const decisions = (code.match(/\b(?:if|for|while|case|catch)\b|&&|\|\||\?\?|\?(?![.?:])/g) || []).length;
  return { file: relativePath, loc, functions: arrowsAndFunctions + methods, complexity: 1 + decisions };
}

/** Builds the markdown table. */
function toMarkdown(phase, rows, totals, context) {
  const lines = [
    `# Static profiling${phase ? ` - ${phase}` : ''}`,
    '',
    `- Generated: ${context.generatedAt}`,
    `- Source commit: ${context.sourceCommit || 'unavailable'}`,
    `- Node: ${process.version}`,
    '- Function counts and complexity are regex estimates, not AST measurements.',
    '',
    '| File | LOC | Functions (approx.) | Complexity (approx.) |',
    '| --- | ---: | ---: | ---: |'
  ];
  rows.forEach((row) => lines.push(`| ${row.file} | ${row.loc} | ${row.functions} | ${row.complexity} |`));
  lines.push(`| **Total (${rows.length} files)** | **${totals.loc}** | **${totals.functions}** | **${totals.complexity}** |`);
  return `${lines.join('\n')}\n`;
}

function main() {
  const phaseIndex = process.argv.indexOf('--phase');
  const phase = phaseIndex > -1 ? process.argv[phaseIndex + 1] : '';
  if (phaseIndex > -1 && (!phase || !/^[a-z0-9][a-z0-9_-]*$/i.test(phase))) {
    throw new Error('--phase requires a simple label such as phase3 or phase4');
  }

  const rows = listSourceFiles().map(analyse);
  const totals = rows.reduce(
    (sum, row) => ({ loc: sum.loc + row.loc, functions: sum.functions + row.functions, complexity: sum.complexity + row.complexity }),
    { loc: 0, functions: 0, complexity: 0 }
  );
  const context = { generatedAt: new Date().toISOString(), sourceCommit: sourceCommit() };
  const markdown = toMarkdown(phase, rows, totals, context);

  if (!phase) {
    process.stdout.write(markdown);
    return;
  }
  const outDir = path.join(ROOT, 'profiling');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${phase}-static.md`), markdown);
  fs.writeFileSync(
    path.join(outDir, `${phase}-static.json`),
    `${JSON.stringify({ phase, ...context, node: process.version, files: rows, totals }, null, 2)}\n`
  );
  console.log(`Wrote profiling/${phase}-static.md and .json (${rows.length} files)`);
}

main();
