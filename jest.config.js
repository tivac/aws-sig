"use strict";

module.exports = {
    watchPathIgnorePatterns : [ "<rootDir>/src/" ],
    
    // Fix exciting localStorage issues because jest uses jsdom wrong
    // https://github.com/jsdom/jsdom/issues/2304
    // https://github.com/facebook/jest/pull/6792
    testURL : "http://localhost",

    // TODO: update jest so this works
    setupFilesAfterEnv : [
        "<rootDir>/build/mock-date.js",
    ],
};
