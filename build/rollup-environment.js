"use strict";

const plugin = require("rollup-plugin-consts");

module.exports = plugin({
    testing : Boolean(process.env.ISTESTING),
});
