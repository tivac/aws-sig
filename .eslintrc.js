"use strict";

module.exports = {
    extends : "@tivac",
    
    parserOptions : {
        ecmaVersion : 8,
        sourceType  : "module",
    },

    globals : {
        ISTESTING : true,
    },

    env : {
        es6  : true,
        node : true,
        jest : true,
    },

    rules : {
        "no-unused-vars" : [ "warn", {
            varsIgnorePattern : "_",
        }],

        "func-style"       : [ "warn", "expression", ],
        "arrow-body-style" : "off",
    }
};
