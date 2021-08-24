import normalizeUrlLib from 'normalize-url';

// we expect this file to have more functions, that's why we suppress this rule
// eslint-disable-next-line import/prefer-default-export
export const normalizeUrl = (url: string): string =>
  normalizeUrlLib(url, { stripHash: true, defaultProtocol: 'https:' });
