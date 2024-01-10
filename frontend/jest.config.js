export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: { '^.+\\.ts?$': 'ts-jest', },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts"
  ],
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(scss|sass|css)$": "identity-obj-proxy"
  }
};