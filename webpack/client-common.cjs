const path = require("path");
const html = require("html-webpack-plugin");

module.exports = {
	entry: "./src/client/client.js",
	target: "web",
	output: {
		filename: "script.js",
		path: path.join(__dirname, "../docs")
	},
	devServer: {
		host: "0.0.0.0",
		historyApiFallback: true,
		hot: true
	},
	plugins: [
		new html({
			template: path.join(__dirname, "../src/client/index.html")
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", {
								useBuiltIns: "usage",
								corejs: '3.8'
							}],
							"@babel/preset-react"
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	}
};
