import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      // Fetching device/render state into useState inside effects is this
      // codebase's established pattern; revisit if adopting the React Compiler
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'ios/**', 'next-env.d.ts'],
  },
]

export default eslintConfig
