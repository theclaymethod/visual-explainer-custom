import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  buildRepoPaths,
  extractBacktickCommandIds,
  readJson,
  validateDocCommandTables,
  validateFormatCoverage,
  validateManifestAgainstFilesystem,
  validateRecipeEntryConsistency,
  validateRouteFixtures,
  validateResolverCoverage
} from '../plugins/visual-explainer/scripts/lib/resolver-utils.mjs';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const paths = buildRepoPaths(repoRoot);
const manifest = readJson(paths.manifestPath);
const routeFixtures = readJson(path.join(repoRoot, 'tests/resolver-cases.json'));
const resolverText = fs.readFileSync(paths.resolverPath, 'utf8');
const readmeText = fs.readFileSync(paths.readmePath, 'utf8');
const skillText = fs.readFileSync(paths.skillPath, 'utf8');
const commandDocs = Object.fromEntries(
  manifest.commands.map(command => [
    command.id,
    fs.readFileSync(path.join(paths.commandDir, `${command.id}.md`), 'utf8')
  ])
);

test('extractBacktickCommandIds finds command ids in markdown', () => {
  const found = extractBacktickCommandIds('Use `generate-video`, then `export-pdf`.');
  assert.deepEqual(found, ['export-pdf', 'generate-video']);
});

test('manifest matches commands and references on disk', () => {
  const errors = validateManifestAgainstFilesystem({
    manifest,
    commandDir: paths.commandDir,
    referenceDir: paths.referenceDir
  });
  assert.deepEqual(errors, []);
});

test('resolver covers every command and video recipe', () => {
  const errors = validateResolverCoverage({ resolverText, manifest });
  assert.deepEqual(errors, []);
});

test('README and SKILL command tables stay in sync with the manifest', () => {
  const errors = validateDocCommandTables({
    docs: { 'README.md': readmeText, 'SKILL.md': skillText },
    manifest
  });
  assert.deepEqual(errors, []);
});

test('every declared format is backed by an output family', () => {
  const errors = validateFormatCoverage(manifest);
  assert.deepEqual(errors, []);
});

test('each video recipe is hosted by a command that actually supports its default format and mentions it by name', () => {
  const errors = validateRecipeEntryConsistency({ manifest, commandDocs });
  assert.deepEqual(errors, []);
});

test('route fixtures cover every command and every video recipe', () => {
  const errors = validateRouteFixtures({ fixtures: routeFixtures, manifest });
  assert.deepEqual(errors, []);
});
