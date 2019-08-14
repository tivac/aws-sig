"use strict";

module.exports = {
    setupFilesAfterEnv : [
        "<rootDir>/build/mock-date.js",
    ],

    clearMocks : true,

    coveragePathIgnorePatterns : [
        "/node_modules/",
        "/src/crypto-es/",
    ],
};
