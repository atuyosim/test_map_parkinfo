module.exports = {
  configureWebpack: {
    plugins: [],
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5267', // API サーバーの URL
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        '__VUE_OPTIONS_API__': JSON.stringify(true),
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true),
      });
      return definitions;
    });
  },
};
