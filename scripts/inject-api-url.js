#!/usr/bin/env node
'use strict';

// Injects env config for the build/serve command, then restores placeholders (prod only).

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

const environmentsDir = path.join(__dirname, '..', 'src', 'environments');
const templatePath = path.join(
  environmentsDir,
  target === 'prod' ? 'environment.prod.ts' : 'environment.dev.ts',
);
const outputPath = target === 'prod' ? templatePath : path.join(environmentsDir, 'environment.local.ts');

const original = fs.readFileSync(templatePath, 'utf8');

if (!original.includes('__WORKSHOP_API_URL__')) {
  console.error(
    `${templatePath} does not contain the __WORKSHOP_API_URL__ placeholder — refusing to run, since ` +
      'either the file already has a real URL baked in or the placeholder was renamed without ' +
      'updating this script.',
  );
  process.exit(1);
}

// Firebase config vars, plus other optional values that shouldn't sit in git
const OPTIONAL_FIREBASE_SUBSTITUTIONS = [
  ['FIREBASE_API_KEY', '__FIREBASE_API_KEY__'],
  ['FIREBASE_AUTH_DOMAIN', '__FIREBASE_AUTH_DOMAIN__'],
  ['FIREBASE_PROJECT_ID', '__FIREBASE_PROJECT_ID__'],
  ['FIREBASE_STORAGE_BUCKET', '__FIREBASE_STORAGE_BUCKET__'],
  ['FIREBASE_MESSAGING_SENDER_ID', '__FIREBASE_MESSAGING_SENDER_ID__'],
  ['FIREBASE_APP_ID', '__FIREBASE_APP_ID__'],
  ['FIREBASE_VAPID_KEY', '__FIREBASE_VAPID_KEY__'],
  ['ADMIN_ALLOWED_EMAILS', '__ADMIN_ALLOWED_EMAILS__'],
];

let content = original.replace('__WORKSHOP_API_URL__', value);

for (const [envVar, placeholder] of OPTIONAL_FIREBASE_SUBSTITUTIONS) {
  const firebaseValue = process.env[envVar];
  if (!firebaseValue) {
    continue;
  }
  if (firebaseValue.includes("'") || firebaseValue.includes('\\')) {
    console.error(`${envVar} contains a quote or backslash, which this simple substitution can't escape safely.`);
    process.exit(1);
  }
  if (!content.includes(placeholder)) {
    console.error(
      `${templatePath} does not contain the ${placeholder} placeholder — refusing to run, since ` +
        'either the file already has a real value baked in or the placeholder was renamed ' +
        'without updating this script.',
    );
    process.exit(1);
  }
  content = content.replace(placeholder, firebaseValue);
}

fs.writeFileSync(outputPath, content);

let restored = false;
function restore() {
  if (restored || outputPath !== templatePath) {
    return;
  }
  restored = true;
  fs.writeFileSync(templatePath, original);
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
