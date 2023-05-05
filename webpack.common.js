const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  plugins: [
    new CopyPlugin({
      patterns: [
        { context: './src', from: "**/*.html", to: "[path][name][ext]" },
        { context: './src', from: "**/*.css", to: "[path][name][ext]" },
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
