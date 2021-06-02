const { override, fixBabelImports, addWebpackAlias, removeModuleScopePlugin } = require('customize-cra');
const path = require('path');
const webpack = require('webpack');
const webapck = require('webpack');

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
  // addWebpackModuleRule({
  //   test: /\.css$/,
  //   use: [
  //     'style-loader',
  //     {
  //       loader: 'typings-for-css-modules-loader',
  //       options: {
  //         modules: true,
  //         namedExport: true,
  //         camelCase: true,
  //       },
  //     },
  //     'css-loader',
  //   ],
  // }),
  // addWebpackModuleRule({ test: /\.css$/, loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase' }),
  // addWebpackModuleRule({
  //   test: /\.scss$/,
  //   loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase&sass',
  // }),
  // addWebpackModuleRule({
  //   test: /\.(sc|sa|c)ss$/,
  //   include: path.join(__dirname, 'src'),
  //   use: [
  //     'css-modules-typescript-loader',
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         modules: true,
  //       },
  //     },
  //   ],
  // use: [
  //   'style-loader',
  //   {
  //     loader: 'typings-for-css-modules-loader',
  //     options: {
  //       modules: true,
  //       namedExport: true,
  //       // camelCase: true,
  //       sass: true,
  //       formatter: 'prettier',
  //       localIdentName: '[local]_[hash:base64:5]',
  //     },
  //   },
  //   'sass-loader',
  // ],
  // }),
);
