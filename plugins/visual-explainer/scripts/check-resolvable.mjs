#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  buildRepoPaths,
  readJson,
  validateDocCommandTables,
  validateFormatCoverage,
  validateManifestAgainstFilesystem,
  validateRecipeEntryConsistency,
  validateRouteFixtures,
  validateResolverCoverage
} from './lib/resolver-utils.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const paths = buildRepoPaths(repoRoot);

const manifest = readJson(paths.manifestPath);
const routeFixtures = readJson(path.join(repoRoot, 'tests/resolver-cases.json'));
const resolverText = fs.readFileSync(paths.resolverPath, 'utf8');
const skillText = fs.readFileSync(paths.skillPath, 'utf8');
const readmeText = fs.readFileSync(paths.readmePath, 'utf8');

const commandDocs = Object.fromEntries(
  manifest.commands.map(command => [
    command.id,
    fs.readFileSync(path.join(paths.commandDir, `${command.id}.md`), 'utf8')
  ])
);

const errors = [
  ...validateManifestAgainstFilesystem({
    manifest,
    commandDir: paths.commandDir,
    referenceDir: paths.referenceDir
  }),
  ...validateResolverCoverage({ resolverText, manifest }),
  ...validateDocCommandTables({
    docs: { 'README.md': readmeText, 'SKILL.md': skillText },
    manifest
  }),
  ...validateFormatCoverage(manifest),
  ...validateRecipeEntryConsistency({ manifest, commandDocs }),
  ...validateRouteFixtures({ fixtures: routeFixtures, manifest })
];

if (errors.length) {
  console.error('check-resolvable failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`check-resolvable passed: ${manifest.commands.length} commands, ${manifest.videoRecipes.length} video recipes`);
