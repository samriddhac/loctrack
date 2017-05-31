var path = require('path');
var webpack = require('webpack'),
HtmlWebpackPlugin = require('html-webpack-plugin');

var config ={
	entry:[
		'./integration-test/index'
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
			template: './integration-test/index.html'
		})
	],
	devServer:{
		port:3030,
		contentBase: './dist'
	}
};
module.exports = config;