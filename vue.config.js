const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];

module.exports = {
  outputDir: "web", // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)
  publicPath:
    process.env.NODE_ENV === "production"
      ? (process.env.VUE_APP_ASSETS_PATH === "static" ? "/" : "https://subscan.l2me.com/")
      : "/", // 部署应用包时的基本 URL。

  // productionSourceMap: false,
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("~", resolve("node_modules"))
      .set("Assets", resolve("src/assets"))
      .set("Components", resolve("src/components"))
      .set("Config", resolve("src/config"))
      .set("Directives", resolve("src/directives"))
      .set("Libs", resolve("src/libs"))
      .set("Plugins", resolve("src/plugins"))
      .set("Routes", resolve("src/routes"))
      .set("Service", resolve("src/service"))
      .set("Utils", resolve("src/utils"))
      .set("Views", resolve("src/views"))
      .set("Locale", resolve("src/locale"));

    // 修改svg loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons"))
      .end();

    // 添加svg-sprite-loader
    config.module
      .rule("svgSpriteLoader")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // 添加打包分析模式
    if (process.env.npm_config_report) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 生产环境 开启gzip
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      );
      // 添加source map
      config.devtool = "cheap-module-source-map";

      config.optimization = {
        splitChunks: {
          chunks: "async",
          minSize: 200000,
          maxSize: 400000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: "~",
          automaticNameMaxLength: 30,
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      };
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        data: `@import "@/assets/style/global.scss";`
      }
    }
  },
  devServer: {
    port: 9527,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      "^/api": {
        target: "https://crayfish.subscan.io", // 接口的域名
        // target: "https://kusama.subscan.io", // 接口的域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "^/api": "/api"
        }
      },
      "^/test": {
        target: "https://crayfish.subscan.io", // 接口的域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "/test": ""
        }
      }
    }
  }
};
