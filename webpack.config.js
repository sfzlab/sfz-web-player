const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    watchFiles: ["./src/*"],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/**/*.html', to: '[name][ext]' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'sfz.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    globalObject: 'this',
    library: {
      name: 'Sfz',
      type: 'umd',
    },
  },
};
