var path = require('path');
var webpack = require('webpack'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin');

var config ={
	entry:[
		'./src/js/index'
	],
	output: {
		path:path.join(__dirname, 'dist'),
		filename:'app.bundle.js',
		publicPath:'/'
	},
	resolve:{
		extensions:[ '.js', '.jsx' ]
	},
	module:{
		loaders:[
			{
				test:/\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}

		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			warnings:true
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new HtmlWebpackPlugin({
			template: './src/html/index.html'
		}),
		new CopyWebpackPlugin([
			{ from: './src/css', to: './style'}
		])
	],
	devServer:{
		port:7001,
		contentBase: './dist'
	}
};
module.exports = config;