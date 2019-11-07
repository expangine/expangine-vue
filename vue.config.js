module.exports = {
  publicPath: '',
  configureWebpack(config) {
    if (process.env.NODE_ENV !== 'production') {
      config.devtool = 'eval-source-map';
      config.module.rules.push({
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      });
    }
  },
};