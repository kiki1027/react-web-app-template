const chalk = require('chalk');
const _ = require('lodash');
const { execSync } = require('child_process');

const failConsole = (error) => {
  console.log(chalk.red('错误!'), error);
};

const successConsole = (message) => {
  console.log('-------------------------------');
  console.log(message);
};

const validateEmpty = (value) => {
  const _value = _.trim(value);

  if (!_value) {
    return '不能为空';
  }
  return true;
};

/**
 * vpn未连接错误拦截器
 * 未连接时自动退出当前进程
 * @param {any} error
 * @param {string} nextCmdString
 */
const vpnErrorInterceptor = (error, nextCmdString) => {
  if (error) {
    failConsole(`请检查网络和 gitlab 连接${nextCmdString ? `后，执行 ${nextCmdString}` : ''}`);
    process.exit(1);
  }
};

/**
 * 获取当前分支名
 * @returns {string} 当前分支名
 */
const getCurrentBranch = () => execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

module.exports = {
  failConsole,
  validateEmpty,
  successConsole,
  vpnErrorInterceptor,
  getCurrentBranch,
};
