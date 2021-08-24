import request from 'superagent';
import { SSCApiError } from './errors';
import { normalizeUrl } from './utils';
import { SecurityScorecardApi, HTTPMethod, ApiCallOptions } from './types';

export default class SecurityScorecardAPI implements SecurityScorecardApi {
  /**
   * Default timeout in milliseconds 6000ms equivalent to 1 minute
   */
  static DEFAULT_TIMEOUT_MS = 6e4;

  /**
   * Default number of retries, by default this value is set to 0.
   * Retries can only be used with requests that are idempotent.
   */
  static DEFAULT_MAX_RETRIES = 0;

  /**
   * By default the sdk will use production 'https://platform-api.securityscorecard.io'
   */
  static DEFAULT_HOST = 'https://platform-api.securityscorecard.io';

  public config: {
    token: string;
    timeout: number;
    host: string;
    maxRetries: number;
  };

  constructor(token: string, options?: { timeout?: number; maxRetries?: number; host?: string }) {
    if (!token) throw new Error('token cannot be empty');
    this.config = {
      token,
      timeout: options?.timeout || SecurityScorecardAPI.DEFAULT_TIMEOUT_MS,
      maxRetries: options?.maxRetries || SecurityScorecardAPI.DEFAULT_MAX_RETRIES,
      host: options?.host || SecurityScorecardAPI.DEFAULT_HOST,
    };
  }

  async apiCall<ResponseType = any>(path: string, options?: ApiCallOptions) {
    const timeout = options?.timeout || this.config.timeout;
    const maxRetries = options?.maxRetries || this.config.maxRetries;
    const method = options?.method || HTTPMethod.GET;
    const { host } = this.config;

    const authorize = options?.authorize ?? true;

    const headers: { [type: string]: string } = {};

    if (authorize) {
      headers.Authorization = `Token ${this.config.token}`;
    }

    const url = normalizeUrl(host.concat(path));

    try {
      const req = request(method, url).timeout(timeout).retry(maxRetries).set(headers);
      if (options?.query) {
        req.query(options.query);
      }
      if (options?.body) {
        req.send(options.body);
      }
      const res = await req;
      return res.status === 204 ? undefined : (res.body as ResponseType);
    } catch (error) {
      const message = `there was an error when trying to call [${method.toUpperCase()}] - ${path}`;
      throw new SSCApiError(message, [error]);
    }
  }
}
