import js from '@eslint/js';

import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.browser } },
	tseslint.configs.recommended,
	{
		files: ['**/dtos/**/*.ts', '**/mappers/**/*.mapper.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{
		files: ['**/server.ts', '**/error-handler.middleware.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		},
	},
	{
		ignores: ['.config/*', 'dist/**/*', 'build/**/*', 'node_modules', '.prettierrc.cjs', 'coverage', '*.min.js'],
	},
]);
