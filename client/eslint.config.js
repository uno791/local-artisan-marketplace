import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jestPlugin from 'eslint-plugin-jest' 
import testingLibrary from 'eslint-plugin-testing-library';


export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    name: 'jest',
    files: ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}'],
    plugins: {
      jest: jestPlugin,
      'testing-library': testingLibrary
    },
    languageOptions: {
      globals: globals.jest
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...jestPlugin.configs.style.rules,
      ...testingLibrary.configs.react.rules 
    }
  }
  
)

