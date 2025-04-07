import { DefaultSoopChatWatcherProvider, StoppableTask } from '@chat-watcher/task/ChatWatchTask';
import { log } from '@common/logger';
import { sleep } from 'bun';
import { beforeEach, expect, jest, test } from 'bun:test';

beforeEach((): void => {
  jest.setTimeout(100000);
});

test('파이썬 프로그램을 별도 쓰레드에서 잘 실행시키는지 체크', async () => {
  // given
  const watcher = new DefaultSoopChatWatcherProvider().createWatcher(
    '봉준',
    'https://play.sooplive.co.kr/janjju/282877502',
    chat => {
      log.trace(`[${chat}]`);
    }
  );

  watcher.start();

  await sleep(20000); // 1초 대기

  watcher.stop();
});
