"use strict";

module.exports = {
    env : {
        test : {
            plugins : [
                // make babel stop being dumb about default exports
                [ "add-module-exports", {
                    addDefaultProperty : true,
                }],

                // Convert ES Modules into CJS
                "@babel/transform-modules-commonjs",
            ],
        },
    },
};
