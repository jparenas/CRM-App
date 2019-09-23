const webpack = require("webpack");
const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "dist/server/public"),
  transpileDependencies: ["vuetify"],
  configureWebpack: config => {
    config.entry = {};
    configToMerge = {
      mode: process.env.NODE_ENV || "development",
      entry: {
        app: ["./client/src/main.ts"]
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client/src"),
          "@c": path.resolve(__dirname, "common/src")
        }
      },
      devServer: {
        watchOptions: {
          host: "localhost"
        }
      }
    };
    if (process.env.NODE_ENV != "production") {
      configToMerge.entry["app"].push("webpack-hot-middleware/client");
    }
    return configToMerge;
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].template = "./server/public/index.html";
      return args;
    });
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};
