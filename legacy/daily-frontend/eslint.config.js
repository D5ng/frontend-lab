import baseConfig from '../../eslint.config.js'

export default [
  ...baseConfig,
  {
    files: ['problems/**/starter.{ts,tsx}'],
    rules: {
      // 미완성 스타터 함수의 입력 인자는 풀이 전까지 사용되지 않을 수 있다.
      'unused-imports/no-unused-vars': ['error', { args: 'none' }],
    },
  },
]
