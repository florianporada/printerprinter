// eslint-disable-next-line node/no-unpublished-require
const HtmlWebPackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line node/no-unpublished-require
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: [path.resolve(__dirname, "src/client/public/index.js")]
  },
  output: {
    path: path.resolve(path.join(__dirname, "dist/client/public")),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "src/client/public"),
    compress: true,
    historyApiFallback: true,
    port: 9000
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "src/client/public/index.html")
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
