import { expect, test } from 'bun:test';

test('crawler interface should have valid afterLoad method', () => {
  // given
  const crawler: Crawler<any> = {
    afterBrowserLoad: async crawlingAction => {
      return crawlingAction({} as any);
    },
  };

  // when
  const result = crawler.afterBrowserLoad(async page => {
    return 'some string value';
  });

  // then
  expect(result).toBeInstanceOf(Promise);
  expect(result).resolves.toBe('some string value');
});
