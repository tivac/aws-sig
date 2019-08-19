"use strict";

const plugin = require("rollup-plugin-consts");

module.exports = plugin({
    // eslint-disable-next-line
    testing : process.env["ISTESTING"],
});
