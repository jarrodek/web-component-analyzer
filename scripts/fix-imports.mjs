import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function fixImport(file) {
  const content = await readFile(file, 'utf-8');
  const newContent = content.replace(/from\s+['"](\.\.?\/[^'"]+)['"]/g, (match, p1) => {
    if (path.extname(p1) === '') {
      return `from '${p1}.js'`;
    }
    return match;
  });

  if (content !== newContent) {
    console.log(`Fixing imports in ${file}`);
    await writeFile(file, newContent, 'utf-8');
  }
}

const file = process.argv[2];
if (!file) {
  console.error('Please provide a file path');
  process.exit(1);
}

fixImport(file).catch(console.error);
