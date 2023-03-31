const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/**/*.html", to: "[name][ext]" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "sfz.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    globalObject: "this",
    library: {
      name: "Sfz",
      type: "umd",
    },
  },
};
