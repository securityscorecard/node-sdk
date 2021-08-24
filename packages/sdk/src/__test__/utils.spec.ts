// eslint-disable-next-line import/no-extraneous-dependencies
import { normalizeUrl } from '../utils';

describe('utils', () => {
  describe('normalizeUrl', () => {
    test('remove trailing slash', () => {
      expect(normalizeUrl('platform-api.securityscorecard.com/')).toEqual('https://platform-api.securityscorecard.com');
    });
    test('default to https', () => {
      expect(normalizeUrl('platform-api.securityscorecard.com/')).toEqual('https://platform-api.securityscorecard.com');
    });
    test('support http://', () => {
      expect(normalizeUrl('http://platform-api.securityscorecard.com/')).toEqual(
        'http://platform-api.securityscorecard.com',
      );
    });
    test('strip hash', () => {
      expect(normalizeUrl('platform-api.securityscorecard.com/#custom_hash')).toEqual(
        'https://platform-api.securityscorecard.com',
      );
    });
    test('fix concat with multiple slashes i.e https://domain.com//path', () => {
      expect(normalizeUrl('platform-api.securityscorecard.com//apps/install')).toEqual(
        'https://platform-api.securityscorecard.com/apps/install',
      );
    });
  });
});
