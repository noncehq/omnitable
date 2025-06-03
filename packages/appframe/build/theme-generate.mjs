import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import compiled theme objects from the dist directory
// Paths are relative to this script's location: packages/appframe/build/
import { common, dark, light } from '../dist/theme/index.js';

const output_path = join(__dirname, '..', 'src', 'styles');

const getVars = (theme) => {
  return Object.keys(theme).reduce((total, key) => {
    const value = theme[key];
    total += `--${key}:${value};\n`; // Ensure newline character
    return total;
  }, '');
};

// Ensure the output directory exists (though it should already)
// import { mkdirSync } from 'fs';
// mkdirSync(output_path, { recursive: true });

writeFileSync(join(output_path, 'common.css'), `.omni,.omnitable_root {\n${getVars(common.default || common)}\n}`);
writeFileSync(join(output_path, 'light.css'), `.omni,.omnitable_root {\n${getVars(light.default || light)}\n}`);
writeFileSync(
  join(output_path, 'dark.css'),
  `[data-theme='dark'] .omni,.dark .omni, [data-theme='dark'] .omnitable_root,.dark .omnitable_root {\n${getVars(dark.default || dark)}\n}`
);

console.log('Theme files generated successfully!');
