"use strict";

const { defaults } = require("jest-config");

module.exports = {
    setupFilesAfterEnv : [
        "<rootDir>/build/env-istesting.js",
        "<rootDir>/build/mock-date.js",
        "<rootDir>/build/mock-consts.js",
    ],

    clearMocks : true,

    coveragePathIgnorePatterns : [
        ...defaults.coveragePathIgnorePatterns,
        "/src/crypto-es/",
        "/test/",
    ],

    transformIgnorePatterns : [
        ...defaults.transformIgnorePatterns,
        "<rootDir>/test/",
    ],
};
