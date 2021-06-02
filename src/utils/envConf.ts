interface EnvConf {
  [key: string]: string;
}

const envConf: unknown = process.env.CONF;

export default {
  SERVICE_API: (envConf as EnvConf)?.SERVICE_API,
  API_ENV: (envConf as EnvConf)?.API_ENV,
};
