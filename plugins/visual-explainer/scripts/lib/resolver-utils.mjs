import fs from 'node:fs';
import path from 'node:path';

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function listBasenames(dirPath, extension) {
  return fs.readdirSync(dirPath)
    .filter(name => name.endsWith(extension))
    .map(name => name.slice(0, -extension.length))
    .sort();
}

export function extractBacktickCommandIds(markdown) {
  const ids = new Set();
  for (const match of markdown.matchAll(/`\/?([a-z0-9-]+)`/g)) {
    ids.add(match[1]);
  }
  return [...ids].sort();
}

export function validateManifestAgainstFilesystem({ manifest, commandDir, referenceDir }) {
  const errors = [];
  const commandIds = manifest.commands.map(command => command.id).sort();
  const commandFiles = listBasenames(commandDir, '.md');
  const referenceFiles = fs.readdirSync(referenceDir).filter(name => name.endsWith('.md')).sort();

  for (const id of commandIds) {
    if (!commandFiles.includes(id)) errors.push(`manifest command '${id}' missing command file`);
  }
  for (const file of commandFiles) {
    if (!commandIds.includes(file)) errors.push(`command file '${file}' missing from manifest`);
  }
  for (const command of manifest.commands) {
    for (const ref of command.requiredRefs) {
      if (!referenceFiles.includes(ref)) {
        errors.push(`command '${command.id}' references missing ref '${ref}'`);
      }
    }
  }

  return errors;
}

export function validateResolverCoverage({ resolverText, manifest }) {
  const resolverCommands = new Set(extractBacktickCommandIds(resolverText));
  const errors = [];

  for (const command of manifest.commands) {
    if (!resolverCommands.has(command.id)) {
      errors.push(`resolver missing command '${command.id}'`);
    }
  }

  for (const recipe of manifest.videoRecipes) {
    if (!resolverText.includes(`\`${recipe.id}\``)) {
      errors.push(`resolver missing video recipe '${recipe.id}'`);
    }
  }

  return errors;
}

export function validateDocCommandTables({ docs, manifest }) {
  const errors = [];
  const commandIds = manifest.commands.map(command => command.id);

  for (const [docName, docText] of Object.entries(docs)) {
    const docIds = new Set(extractBacktickCommandIds(docText));
    for (const commandId of commandIds) {
      if (!docIds.has(commandId)) {
        errors.push(`${docName} missing command '${commandId}'`);
      }
    }
  }

  return errors;
}

export function validateFormatCoverage(manifest) {
  const errors = [];
  const outputFormats = new Set(manifest.outputFamilies.flatMap(family => family.formats));

  for (const command of manifest.commands) {
    for (const format of command.supportedFormats) {
      if (!outputFormats.has(format)) {
        errors.push(`command '${command.id}' uses unknown format '${format}'`);
      }
    }
  }

  for (const recipe of manifest.videoRecipes) {
    if (!outputFormats.has(recipe.defaultFormat)) {
      errors.push(`recipe '${recipe.id}' uses unknown default format '${recipe.defaultFormat}'`);
    }
  }

  return errors;
}

export function validateRecipeEntryConsistency({ manifest, commandDocs }) {
  const errors = [];
  const commands = new Map(manifest.commands.map(command => [command.id, command]));

  for (const recipe of manifest.videoRecipes) {
    const entry = commands.get(recipe.entryCommand);
    if (!entry) {
      errors.push(`recipe '${recipe.id}' entryCommand '${recipe.entryCommand}' missing from manifest`);
      continue;
    }
    if (!entry.supportedFormats.includes(recipe.defaultFormat)) {
      errors.push(`recipe '${recipe.id}' defaultFormat '${recipe.defaultFormat}' not in entryCommand '${recipe.entryCommand}' supportedFormats`);
    }
    const doc = commandDocs[recipe.entryCommand];
    if (doc === undefined) continue;
    if (!doc.includes(recipe.id)) {
      errors.push(`recipe '${recipe.id}' is not mentioned in its entryCommand doc '${recipe.entryCommand}.md'`);
    }
  }

  for (const [commandId, doc] of Object.entries(commandDocs)) {
    const command = commands.get(commandId);
    if (!command || command.kind !== 'video') continue;
    for (const recipe of manifest.videoRecipes) {
      if (recipe.entryCommand === commandId) continue;
      const wordBoundary = new RegExp(`\\b${recipe.id}\\b`);
      if (wordBoundary.test(doc)) {
        const hosted = manifest.videoRecipes
          .filter(r => r.entryCommand === commandId)
          .map(r => r.id);
        const ownLooksLike = hosted.some(id => id === recipe.id);
        if (!ownLooksLike && !doc.includes(`See \`./RESOLVER.md\``) && !doc.includes('route through')) {
          errors.push(`command '${commandId}' mentions recipe '${recipe.id}' but does not host it; add an explicit handoff reference`);
        }
      }
    }
  }

  return errors;
}

export function validateRouteFixtures({ fixtures, manifest }) {
  const errors = [];
  const commands = new Map(manifest.commands.map(command => [command.id, command]));
  const recipes = new Map(manifest.videoRecipes.map(recipe => [recipe.id, recipe]));

  for (const fixture of fixtures) {
    const command = commands.get(fixture.command);
    if (!command) {
      errors.push(`route fixture '${fixture.prompt}' references unknown command '${fixture.command}'`);
      continue;
    }
    if (fixture.format && !command.supportedFormats.includes(fixture.format)) {
      errors.push(`route fixture '${fixture.prompt}' uses format '${fixture.format}' not supported by '${fixture.command}'`);
    }
    if (fixture.recipe) {
      const recipe = recipes.get(fixture.recipe);
      if (!recipe) {
        errors.push(`route fixture '${fixture.prompt}' references unknown recipe '${fixture.recipe}'`);
        continue;
      }
      if (recipe.entryCommand !== fixture.command) {
        errors.push(`route fixture '${fixture.prompt}' maps recipe '${fixture.recipe}' to '${fixture.command}', expected '${recipe.entryCommand}'`);
      }
    }
  }

  for (const command of manifest.commands) {
    if (!fixtures.some(fixture => fixture.command === command.id)) {
      errors.push(`route fixtures missing coverage for command '${command.id}'`);
    }
  }

  for (const recipe of manifest.videoRecipes) {
    if (!fixtures.some(fixture => fixture.recipe === recipe.id)) {
      errors.push(`route fixtures missing coverage for recipe '${recipe.id}'`);
    }
  }

  return errors;
}

export function buildRepoPaths(repoRoot) {
  return {
    repoRoot,
    pluginRoot: path.join(repoRoot, 'plugins/visual-explainer'),
    commandDir: path.join(repoRoot, 'plugins/visual-explainer/commands'),
    referenceDir: path.join(repoRoot, 'plugins/visual-explainer/references'),
    manifestPath: path.join(repoRoot, 'plugins/visual-explainer/commands/manifest.json'),
    resolverPath: path.join(repoRoot, 'plugins/visual-explainer/RESOLVER.md'),
    skillPath: path.join(repoRoot, 'plugins/visual-explainer/SKILL.md'),
    readmePath: path.join(repoRoot, 'README.md')
  };
}
