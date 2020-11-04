/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
	packageManager   : "npm",
	testRunner       : "jest",
	coverageAnalysis : "off",
	
	reporters : [
		"html",
		"clear-text",
		"progress",
	],

	mutate : [
		"src/**/*.js",
		"!src/crypto-es/**/*.js",
	],
};
