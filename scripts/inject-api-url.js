#!/usr/bin/env node
'use strict';

// Substitutes the __WORKSHOP_API_URL__ placeholder in the target environment file with a real
// URL, runs the given command (e.g. `ng serve` or `ng build --configuration production`), then
// always restores the placeholder afterward — on normal exit, on the command's own exit, and on
// Ctrl+C/SIGTERM — so the working tree (and anything committed to git) never ends up with a real
// URL baked in.
//
// Locally (target `dev`): loads a gitignored .env (see .env.example) for WORKSHOP_API_URL — this
// is the one supported local path, and it only ever points at the DEV backend; there is no local
// path for target `prod`, production builds only happen in CI.
// In CI: reads WORKSHOP_API_URL from process.env, populated by the env: block on the build step
// (sourced from a GitHub Actions Environment variable — production or development — see
// README.md's "Environment config" section).

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function loadDotEnvIfPresent(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const target = process.argv[2];
const commandArgs = process.argv.slice(3);

if ((target !== 'dev' && target !== 'prod') || commandArgs.length === 0) {
  console.error('Usage: node scripts/inject-api-url.js <dev|prod> <command...>');
  process.exit(1);
}

if (target === 'dev') {
  loadDotEnvIfPresent(path.join(__dirname, '..', '.env'));
}

const value = process.env.WORKSHOP_API_URL;
if (!value) {
  console.error(
    'Missing WORKSHOP_API_URL. Set it in a local .env (copy .env.example) for `dev`, or as a ' +
      'GitHub Actions Environment variable in CI — see README.md.',
  );
  process.exit(1);
}
if (value.includes("'") || value.includes('\\')) {
  console.error("WORKSHOP_API_URL contains a quote or backslash, which this simple substitution can't escape safely.");
  process.exit(1);
}

const filePath = path.join(
  __dirname,
  '..',
  'src',
  'environments',
  target === 'prod' ? 'environment.prod.ts' : 'environment.dev.ts',
);
const original = fs.readFileSync(filePath, 'utf8');

if (!original.includes('__WORKSHOP_API_URL__')) {
  console.error(
    `${filePath} does not contain the __WORKSHOP_API_URL__ placeholder — refusing to run, since ` +
      'either the file already has a real URL baked in or the placeholder was renamed without ' +
      'updating this script.',
  );
  process.exit(1);
}

fs.writeFileSync(filePath, original.replace('__WORKSHOP_API_URL__', value));

let restored = false;
function restore() {
  if (restored) {
    return;
  }
  restored = true;
  fs.writeFileSync(filePath, original);
}

const child = spawn(commandArgs[0], commandArgs.slice(1), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.on('SIGINT', () => {
  restore();
  child.kill('SIGINT');
});
process.on('SIGTERM', () => {
  restore();
  child.kill('SIGTERM');
});

child.on('exit', (code, signal) => {
  restore();
  process.exit(code === null ? (signal ? 1 : 0) : code);
});

child.on('error', (err) => {
  console.error(err);
  restore();
  process.exit(1);
});
