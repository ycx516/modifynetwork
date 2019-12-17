"use strict";

let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");

//let LessExtractText = new ExtractTextPlugin("./css/[name].css");

module.exports = {
	context: __dirname,
	entry: {
		"index": [
			"./src/js/app.js",
			"./src/less/register/global.less"
		],
		"common": [
			"./src/less/common.less"
		]
	},
	output: {
		path: `${__dirname}/built`,
		public: "/",
		filename: "./js/[name].js"
	},
	devtool: "source-map",
	module: {
        preLoaders: [{
            test: /\.js$/, exclude: /node_modules/, loader: "eslint"
        }],
        loaders: [
            { test: /\.js$/, exclude: /node_modules|src\/flow|thegraph/, loader: "babel" },
            //{ test: /\.js$/, exclude: /node_modules/, loader: "eslint" },
            //{ test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
            { test: require.resolve("ip"), loader: "expose?_IP" },
            { test: require.resolve("ipaddr.js"), loader: "expose?_IPAddr" },
            //{ test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?name=[path][name].[ext]'},
            { test: /\.gif|png|jpg|jpeg|svg|ttf|woff2?|eot/,exclude: /src\/flow|thegraph/, loader: "file",
                query: {
                    name: "/img/[name].[ext]"
                }
            },
            //{ test: /\.less$/, loader: "less" },
            { test: /\.less$/,exclude: /src\/flow|thegraph/, loader: ExtractTextPlugin.extract(["css", "less"]) }
        ],
        
    },
    eslint: {
        //configFile: './.eslintrc.js', // 指定eslint的配置文件在哪里
        failOnWarning: true, // eslint报warning了就终止webpack编译
        failOnError: true, // eslint报error了就终止webpack编译
        cache: false // 开启eslint的cache，cache存在node_modules/.cache目录里
    },
	plugins: [
		new ExtractTextPlugin("./css/[name].css")/*,
		new webpack.optimize.UglifyJsPlugin({
			//压缩代码
			compress: {
				warnings: false
			},
			mangle: false
			// except: ['$super', '$', 'exports', 'require']	//排除关键字
		})*/
	],
	devServer: {
		port: 22333,
		host: "0.0.0.0",
        disableHostCheck: true,
		contentBase: `${__dirname}/src`,
		info: true
	}
};