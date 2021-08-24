const { SSC_API_TOKEN, SSC_API_HOST } = process.env;

type SDKConfigs = {
  token?: string;
  host?: string;
};

const configs: SDKConfigs = {
  token: SSC_API_TOKEN,
  host: SSC_API_HOST,
};

export default configs;
