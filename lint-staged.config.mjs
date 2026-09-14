/** @type {import("lint-staged").Configuration} */
const config = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{js,mjs,json,css,html,md,yml,yaml}': 'prettier --write',
}

export default config
