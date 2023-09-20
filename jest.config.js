const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  collectCoverage: process.env.NODE_ENV === "production",
  resetMocks: true,
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.test.[jt]s?(x)'],
  moduleNameMapper: { // Matching paths listed in tsconfig.json
    "@/components/(.*)": ["<rootDir>/src/components/$1"],
    "@/styles/(.*)": ["<rootDir>/src/styles/$1"],
    "@/lib/(.*)": ["<rootDir>/src/lib/$1"],
    "@/public/(.*)": ["<rootDir>/public/$1"],
    "@/app/(.*)": ["<rootDir>/src/app/$1"]
  }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
