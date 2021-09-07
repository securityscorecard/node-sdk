// more information about app actions headers can be found here
// https://securityscorecard.readme.io/docs/app-actions#authentication

const X_SSC_APP_SECRETS = 'x-ssc-app-secrets';
const X_SSC_APP_ID = 'x-ssc-app-id';
const X_SSC_ACTION = 'x-ssc-action';

const getHeaderValueAsString = (headers, key) => {
    const headerValue =  headers[key] && headers[key];
    return Array.isArray(headerValue) ? headerValue[0] : headerValue;
};
  
const extractSecretsFromHeaders = (headers) => {
    const headerValue = getHeaderValueAsString(headers, X_SSC_APP_SECRETS);
    if (!headerValue) return null;
    return JSON.parse(headerValue);
};

const extractActionFromHeaders = (headers) => getHeaderValueAsString(headers, X_SSC_ACTION);

const extractAppIdFromHeaders = (headers) => getHeaderValueAsString(headers, X_SSC_APP_ID);

const extractSSCHeaders = (headers) => ({
    appSecrets: extractSecretsFromHeaders(headers),
    action: extractActionFromHeaders(headers),
    appId: extractAppIdFromHeaders(headers),
});

module.exports = extractSSCHeaders;