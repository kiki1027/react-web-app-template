const { EnvConfigSetting } = require('./env.config');

/**
 * 按照配置文件设置获取当前环境设置
 * @date 2021-06-03
 * @param {typeof EnvConfigSetting[NodeEnv]} envConfigSetting
 * @returns {{env:string, api:string, active:boolean, default:boolean}}
 */
const getCurrentEnvConfig = (envConfigSetting) => {
  return Object.entries(envConfigSetting)
    ?.filter(([, conf]) => conf?.active)
    ?.map(([env, conf]) => ({ env, ...conf }))?.[0];
};

/**
 * 按照配置文件设置获取默认环境设置
 * @date 2021-06-03
 * @param {typeof EnvConfigSetting[NodeEnv]} envConfigSetting
 * @returns {{env:string, api:string, active:boolean, default:boolean}}
 */
const getDefaultEnvConfig = (envConfigSetting) => {
  return Object.entries(envConfigSetting)
    ?.filter(([, conf]) => conf?.default)
    ?.map(([env, conf]) => ({ env, ...conf }))?.[0];
};

/**
 * 获取环境配置
 * @date 2021-06-03
 * @description 生产构建时使用打包进来的环境变量，开发构建使用env.config.js的配置
 * @param {'development' | 'production' | 'test'} nodeEnv
 * @param {string?} branch
 * @returns {{API_ENV:string, SERVICE_API:string}}
 */
const getEnvConf = (nodeEnv, branch) => {
  // 生产构建
  if (nodeEnv === 'production') {
    const prodEnvConfig = EnvConfigSetting.production;
    const currentEnvConfig = prodEnvConfig[branch];
    return currentEnvConfig ? { API_ENV: branch, SERVICE_API: currentEnvConfig?.api } : {};
  }

  // 开发构建
  if (nodeEnv === 'development') {
    const devEnvConfig = EnvConfigSetting.development;
    const currentEnvConfig = getCurrentEnvConfig(devEnvConfig);
    const defaultEnvConfig = getDefaultEnvConfig(devEnvConfig);
    const config = currentEnvConfig ?? defaultEnvConfig;
    return config ? { API_ENV: config?.env, SERVICE_API: config?.api } : {};
  }

  return {};
};

module.exports = { getCurrentEnvConfig, getDefaultEnvConfig, getEnvConf };
