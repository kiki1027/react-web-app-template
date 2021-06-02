const { getEnvConf } = require('../configs/utils');

interface BuildEnvConf {
  [key: string]: string;
}

const nodeEnv = process.env.NODE_ENV;

// 配置文件里的配置
const envConfigFileSetting = getEnvConf(nodeEnv, null);

// 生产构建注入的环境变量
const buildEnvConf = process.env.CONF ?? {};

// 生产构建时使用打包进来的环境变量，开发构建使用env.config.js的配置
const envConf =
  nodeEnv === 'production'
    ? {
        SERVICE_API: (buildEnvConf as BuildEnvConf)?.SERVICE_API,
        API_ENV: (buildEnvConf as BuildEnvConf)?.API_ENV,
      }
    : envConfigFileSetting;

console.log('envConf: ', { ...buildEnvConf, ...envConf });

export default envConf;
