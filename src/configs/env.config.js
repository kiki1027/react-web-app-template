const EnvConfigSetting = {
  development: {
    dev: { api: 'http://fake-api/dev', active: true, default: false },
    feat: { api: 'http://fake-api/feature', active: false, default: true },
    test: { api: 'http://fake-api/test', active: false, default: false },
    prod: { api: 'http://fake-api/', active: false, default: false },
  },
  production: {
    dev: { api: 'http://fake-api/dev' },
    feat: { api: 'http://fake-api/feature' },
    test: { api: 'http://fake-api/test' },
    prod: { api: 'http://fake-api/' },
  },
};

exports.EnvConfigSetting = EnvConfigSetting;
