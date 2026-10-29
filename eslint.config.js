import eslint from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  {
    // legacy는 보관만 하고 실행·검사하지 않는다.
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**', 'legacy/**'],
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      // 사용하지 않는 import는 자동 수정으로 지우고, 나머지 미사용 변수는 기존처럼 오류로 알린다.
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // import는 외부 패키지 → 별칭 → 상대 경로 → CSS 순으로 빈 줄 없이 정렬하고, 타입만 가져오면 import type으로 표시한다.
      'simple-import-sort/imports': [
        'error',
        { groups: [['^\\u0000(?!.*\\.css$)', '^@?\\w', '^seed-design/', '^\\.', '^\\u0000.*\\.css$']] },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    // SEED CLI가 설치한 스니펫은 원본과 비교할 수 있도록 import를 다시 정렬하지 않는다.
    files: ['**/src/seed-design/**'],
    rules: {
      'simple-import-sort/imports': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
    },
  },
)
