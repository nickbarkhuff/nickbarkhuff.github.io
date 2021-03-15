const { merge } = require("webpack-merge");
const common = require("./client-common.cjs");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map"
});
