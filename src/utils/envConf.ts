import envConfigJson from '../../env.config.json';

const nodeEnv = process.env.NODE_ENV;
const devEnvConfig = envConfigJson.development;
console.log('devEnvConfig: ', devEnvConfig);
const prodEnvConfig = envConfigJson.production;
console.log('prodEnvConfig: ', prodEnvConfig);

const currentEnvConfig = Object.entries(devEnvConfig)
  ?.filter(([, conf]) => conf?.active)
  ?.map(([, conf]) => conf)?.[0];
const defaultEnvConfig = Object.entries(devEnvConfig)
  ?.filter(([, conf]) => conf?.default)
  ?.map(([, conf]) => conf)?.[0];
console.log('defaultEnvConfig: ', defaultEnvConfig);
console.log('currentEnvConfig: ', currentEnvConfig);

console.log(process.env.NODE_ENV);

const getApiDomain = (): string => {
  // 生产构建
  if (nodeEnv === 'production') {
    return '';
  }
  // 开发构建
  if (nodeEnv === 'development') {
    return '';
  }

  return '';
};

export default {
  ENV: '',
  API: getApiDomain(),
};
