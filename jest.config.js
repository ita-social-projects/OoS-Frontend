module.exports = {
  "moduleNameMapper": {
    '^shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^shared-services/(.*)$': '<rootDir>/src/app/shared/services/$1',
    '^shared-components/(.*)$': '<rootDir>/src/app/shared/components/$1',
    '^shared-enum/(.*)$': '<rootDir>/src/app/shared/enum/$1',
    '^shared-models/(.*)$': '<rootDir>/src/app/shared/models/$1',
    '^shared-constants/(.*)$': '<rootDir>/src/app/shared/constants/$1'
  },
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
      isolatedModules: true,
    },
  },
  "modulePaths": ["<rootDir>/src"],
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
