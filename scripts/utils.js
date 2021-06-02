const chalk = require('chalk');
const _ = require('lodash');
const { execSync } = require('child_process');
const envConfigJson = require('../env.config.json');

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

const getCurrentEnvConfig = (envConfigSetting) => {
  return Object.entries(envConfigSetting)
    ?.filter(([, conf]) => conf?.active)
    ?.map(([, conf]) => conf)?.[0];
};

const getDefaultEnvConfig = (envConfigSetting) => {
  return Object.entries(envConfigSetting)
    ?.filter(([, conf]) => conf?.default)
    ?.map(([, conf]) => conf)?.[0];
};

const getEnvConf = (nodeEnv, branch) => {
  console.log('branch: ', branch);
  console.log('nodeEnv: ', nodeEnv);

  // 生产构建
  if (nodeEnv === 'production') {
    const prodEnvConfig = envConfigJson.production;
    console.log('prodEnvConfig: ', prodEnvConfig);
    const currentEnvConfig = prodEnvConfig[branch];
    return currentEnvConfig ? { API_ENV: branch, SERVICE_API: currentEnvConfig?.api } : {};
  }

  // 开发构建
  if (nodeEnv === 'development') {
    const devEnvConfig = envConfigJson.development;
    console.log('devEnvConfig: ', devEnvConfig);

    const currentEnvConfig = getCurrentEnvConfig(devEnvConfig);
    const defaultEnvConfig = getDefaultEnvConfig(devEnvConfig);
    console.log('defaultEnvConfig: ', defaultEnvConfig);
    console.log('currentEnvConfig: ', currentEnvConfig);
    const config = currentEnvConfig ?? defaultEnvConfig;
    return config ? { API_ENV: config?.env, SERVICE_API: config?.api } : {};
  }

  return {};
};

module.exports = {
  failConsole,
  validateEmpty,
  successConsole,
  vpnErrorInterceptor,
  getCurrentBranch,
  getEnvConf,
};
