
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  base:'/var/lib/jenkins/workspace/deploy_penda/',
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true
      },
      dynamicImport: false,
      title: 'penda',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    "/api": {
      target: "http://106.88.128.219:7001/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  }
}
