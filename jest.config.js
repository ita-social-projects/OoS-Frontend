module.exports = {
  "preset": "jest-preset-angular",
  "setupFilesAfterEnv": [
    "<rootDir>/setup-jest.ts"
  ],
  "extensionsToTreatAsEsm": ['.ts'],
  "globalSetup": 'jest-preset-angular/global-setup',
  "globals": {
    "ts-jest": {
      "tsconfig": "<rootDir>/tsconfig.spec.json",
      "stringifyContentPathRegex": "\\.(html|svg)$",
      "useESM": "true",
    },
  },
  "transform": {
    "^.+\\.(ts|mjs|js|html)$": "jest-preset-angular",
  },
  "transformIgnorePatterns": ["<rootDir>/node_modules/(?!.*\\.mjs$|@angular|@rxjs|@ngrx|ngx-socket-io)"],
  "snapshotSerializers": [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
  "testPathIgnorePatterns": [
            "<rootDir>/node_modules/",
            "<rootDir>/dist/",
            "<rootDir>/cypress/",
            "<rootDir>/src/test.ts",
            "<rootDir>/src/app/shell/shell.component.spec.ts"
        ]
};