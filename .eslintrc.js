"use strict";

module.exports = {
    extends : "@tivac",
    
    env : {
        node : true
    },

    rules : {
        "no-unused-vars" : [ "warn", {
            varsIgnorePattern : "_"
        } ],

        "func-style" : [ "warn", "expression" ]
    }
};
