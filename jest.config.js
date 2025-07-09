module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/chapters", "<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    collectCoverageFrom: ["chapters/**/*.ts", "src/**/*.ts", "!**/*.d.ts", "!**/node_modules/**"],
    moduleFileExtensions: ["ts", "js", "json"],
    verbose: true,
};
