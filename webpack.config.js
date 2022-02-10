const webpack = require('webpack');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
// const ExtensionReloader = require('webpack-chrome-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');


const config = {
	mode: process.env.NODE_ENV,
	context: __dirname + '/src',
	entry: {
		'page/background':'./background/background.js',
		'page/popup': './popup/popup.js',
		'page/options': './options/options.js',
		'content/baidu':'./content/baidu.js',  //放在entry里，就会根据rules里的规则，进行转化。否则只按照new CopyPlugin直接复制
		'page/entry':'./content/entry.js',
		'inject/baidu/index':'./inject/baidu/index.js',
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.js', '.vue'],
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loaders: 'vue-loader',
			},
			{
				test: /\.js$/,
				use:{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					}
				},
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.sass$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
					outputPath: '/images/',
					emitFile: false,
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: '/fonts/',
					emitFile: false,
				},
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			global: 'window',
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new CopyPlugin([
			{ from: 'assets/icons', to: 'icons', ignore: ['icon.xcf'] },
			{ from: 'assets/image', to: 'img', ignore: ['icon.xcf'] },
			{ from: 'background/background.html', to: 'page/background.html', transform: transformHtml },
			{ from: 'popup/popup.html', to: 'page/popup.html', transform: transformHtml },
			{ from: 'options/options.html', to: 'page/options.html', transform: transformHtml },
			{ from: 'inject/baidu/index.html', to: 'inject/baidu/index.html', transform: transformHtml },
			{
				from: 'manifest.json',
				to: 'manifest.json',
				transform: (content) => {
					const jsonContent = JSON.parse(content);
					jsonContent.version = version;
					return JSON.stringify(jsonContent, null, 2);
				},
			},
			
			{
				from:'content/baidu.js',
				to:'content/baidu.js',
			},
			{
				from:'assets/fonts',
				to:'fonts',
			},
			{
				from:'content/entry.js',
				to:'page/entry.js',
			},
		]),
		// 2021.08.19添加：
		new webpack.ProvidePlugin({
			$:'jquery',
			jQuery:'jquery',
			jquery:'jquery',
			"window.jQuery":'jquery'
		})

	],
};

if (config.mode === 'production') {
	config.plugins = (config.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
				// BASE_URL:"https://baidu.com"
			},
		}),
	]);
}
// else{
// 	config.plugins = (config.plugins || []).concat([
// 		new webpack.DefinePlugin({
// 			'process.env': {
// 				BASE_URL:'"https://baidu.com"'
// 			},
// 		}),
// 	]);
// }


// 配置自动重载插件
if (process.env.HMR === 'true') { 
	config.plugins = (config.plugins || []).concat([
		new ExtensionReloader({
			entries:{
				background:'page/background', // background改变的时候，自动刷新插件
				contentScript:'content/baidu' 
			}
		}),
	]);
}

function transformHtml(content) {
	return ejs.render(content.toString(), {
		...process.env,
	});
}

module.exports = config;
