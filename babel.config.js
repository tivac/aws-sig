"use strict";

module.exports = {
    env : {
        test : {
            plugins : [
                // Convert all of our environment flags to static values
                [ "transform-define", {
                    ISTESTING : true,
                }],

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
