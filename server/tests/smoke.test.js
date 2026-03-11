'use strict';

/**
 * Server smoke tests — zero extra dependencies.
 * Uses Node's built-in `assert` and `child_process` modules only.
 *
 * 1. Syntax-checks every server source file via `node --check`.
 * 2. Unit-tests noteService logic by stubbing the `fs` module.
 */

const assert = require('assert');
const path = require('path');
const { execSync } = require('child_process');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(`        ${err.message}`);
    failed++;
  }
}

const ROOT = path.join(__dirname, '..');

// ── 1. Syntax checks ─────────────────────────────────────────────────────────

test('All server source files pass node --check', () => {
  const files = [
    'index.js',
    'routes/notesRoutes.js',
    'routes/translateRoutes.js',
    'routes/extractRoutes.js',
    'controllers/notesController.js',
    'controllers/translateController.js',
    'controllers/extractController.js',
    'services/noteService.js',
  ];
  files.forEach((f) => {
    execSync(`node --check ${path.join(ROOT, f)}`, { stdio: 'pipe' });
  });
});

// ── 2. noteService unit logic (fs-stubbed, no disk I/O) ──────────────────────

function withStubbedFs(fakeNotes, fn) {
  const fs = require('fs');
  const origExistsSync = fs.existsSync;
  const origReadFileSync = fs.readFileSync;
  const origWriteFileSync = fs.writeFileSync;

  fs.existsSync = () => true;
  fs.readFileSync = () => JSON.stringify(fakeNotes);
  fs.writeFileSync = () => {};

  const servicePath = require.resolve('../services/noteService');
  delete require.cache[servicePath];

  try {
    fn(require('../services/noteService'));
  } finally {
    fs.existsSync = origExistsSync;
    fs.readFileSync = origReadFileSync;
    fs.writeFileSync = origWriteFileSync;
    delete require.cache[servicePath];
  }
}

test('noteService.searchNotes filters by title keyword (case-insensitive)', () => {
  const fakeNotes = [
    { id: '1', title: 'Hello World', content: 'foo', createdAt: '' },
    { id: '2', title: 'Meeting notes', content: 'bar', createdAt: '' },
  ];
  withStubbedFs(fakeNotes, (noteService) => {
    const results = noteService.searchNotes('hello');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].id, '1');
  });
});

test('noteService.searchNotes filters by content keyword', () => {
  const fakeNotes = [
    { id: 'a', title: 'Alpha', content: 'contains important info', createdAt: '' },
    { id: 'b', title: 'Beta', content: 'nothing here', createdAt: '' },
  ];
  withStubbedFs(fakeNotes, (noteService) => {
    const results = noteService.searchNotes('important');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].id, 'a');
  });
});

test('noteService.searchNotes returns empty array when no match', () => {
  const fakeNotes = [
    { id: '1', title: 'Hello', content: 'World', createdAt: '' },
  ];
  withStubbedFs(fakeNotes, (noteService) => {
    const results = noteService.searchNotes('zzznomatch');
    assert.strictEqual(results.length, 0);
  });
});

test('noteService.getAllNotes returns all notes', () => {
  const fakeNotes = [
    { id: '1', title: 'A', content: 'a', createdAt: '' },
    { id: '2', title: 'B', content: 'b', createdAt: '' },
  ];
  withStubbedFs(fakeNotes, (noteService) => {
    const results = noteService.getAllNotes();
    assert.strictEqual(results.length, 2);
  });
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  process.exit(1);
}
