const {
  override,
  fixBabelImports,
  addWebpackAlias,
  removeModuleScopePlugin,
  addWebpackPlugin,
} = require('customize-cra');
const path = require('path');
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();
const { getEnvConf } = require('./src/configs/utils');

const nodeEnv = process.env.NODE_ENV;

module.exports = override(
  // antd 按需加载配置
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  // 别名
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@containers': path.resolve(__dirname, 'src/containers'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@routes': path.resolve(__dirname, 'src/routes'),
    '@services': path.resolve(__dirname, 'src/services'),
  }),
  // 去除 src/ 限制
  removeModuleScopePlugin(),
  // 增加全局环境变量
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.CONF': JSON.stringify({
        VERSION: gitRevisionPlugin.version(),
        COMMIT_HASH: gitRevisionPlugin.commithash(),
        BRANCH: gitRevisionPlugin.branch(),
        ...getEnvConf(nodeEnv, 'test'),
      }),
    }),
  ),
);
