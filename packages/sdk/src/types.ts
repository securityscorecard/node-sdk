import { AppsModule } from './modules/types';

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export type ApiCallOptions = {
  method?: HTTPMethod;
  authorize?: boolean;
  timeout?: number;
  maxRetries?: number;
  query?: any;
  body?: any;
};

export type SecurityScorecardApi = {
  apiCall<ResponseType = any>(url: string, options?: ApiCallOptions): Promise<ResponseType | undefined>;
};

export type SecurityScorecardSDK = {
  api: SecurityScorecardApi;
  apps: AppsModule;
};
