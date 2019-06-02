const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const PATHS = {
  build: path.join(__dirname, '..', 'api', 'target', 'classes', 'public')
};

module.exports = {
  entry: ["./src/js/index.js"],
  output: {
    path: PATHS.build,
    filename: "js/[name].js"
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(png|jp(e*)g|svg)$/,  use: [{
        loader: 'url-loader',
        options: { 
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
        } 
      }]}
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};