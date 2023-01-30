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
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  // Matching paths listed in tsconfig.json
  moduleNameMapper: {
    "@/components/(.*)": ["<rootDir>/src/components/$1"],
    "@/pages/(.*)": ["<rootDir>/src/pages/$1"],
    "@/styles/(.*)": ["<rootDir>/src/styles/$1"],
    "@/lib/(.*)": ["<rootDir>/src/lib/$1"],
    "@/public/(.*)": ["<rootDir>/public/$1"],
    "@/__tests__/(.*)": ["<rootDir>/src/__tests__/$1"],
  }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
