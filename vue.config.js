module.exports = {
  configureWebpack(config) {
    config.devtool = 'eval-source-map';
    config.module.rules.push({
      test: /\.js$/,
      use: ["source-map-loader"],
      enforce: "pre",
    });
  }
}