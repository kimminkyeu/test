import { SoopBroadcasterApi } from '@chat-watcher/internal/SoopBroadcasterApi';
import { InMemorySoopChatWatcherManager } from '@chat-watcher/internal/SoopChatWatcherManager';
import { ChatWatcherManagingTask } from '@chat-watcher/task/ChatWatcherManagingTask';
import { SoopChatWatcherProvider, StoppableTask } from '@chat-watcher/task/ChatWatchTask';
import { log } from '@common/logger';
import { SoopLiveDetectorApiDto } from '@common/SoopLiveDetectorApiResponse';
import { sleep } from 'bun';
import { beforeEach, expect, jest, test } from 'bun:test';

/**
 * 가짜 테스트 BJ 데이터에 대해 ChatWatcherTask가 잘 관리 작동하는지 확인
 */

class FakeSoopBroadcasterApiImpl implements SoopBroadcasterApi {
  private supplier: () => SoopLiveDetectorApiDto[];

  constructor(supplier: () => SoopLiveDetectorApiDto[]) {
    this.supplier = supplier;
  }

  public async getAll(): Promise<SoopLiveDetectorApiDto[]> {
    const testData = this.supplier();
    return new Promise(function giveFakeData(resolve) {
      resolve(testData);
    });
  }

  public changeSupplier(supplier: () => SoopLiveDetectorApiDto[]) {
    this.supplier = supplier;
  }
}

class FakeChatWatcher implements StoppableTask {
  private readonly bjName: string;
  private intervalId: any;

  public constructor(bjName: string, liveUrl: string) {
    this.bjName = bjName;
  }

  public start(): void {
    log.debug(`Started Fake watching ${this.bjName}`);
    let i = 0;
    this.intervalId = setInterval(() => {
      log.trace(`BJ-${this.bjName}, [?], [랜덤 채팅 ${i++}]`);
    }, 1000); // 1초마다 상태를 체크한다.
  }

  public stop(): void {
    log.debug(`Stopped Fake watching ${this.bjName}`);
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

class FakeSoopChatWatcherProvider implements SoopChatWatcherProvider {
  createWatcher(bjName: string, liveUrl: string): StoppableTask {
    return new FakeChatWatcher(bjName, liveUrl);
  }
}

beforeEach((): void => {
  jest.setTimeout(30000);
});

test('가짜 테스트 BJ 데이터에 대해 ChatWatcherTask를 잘 관리 작동하는지 확인', async () => {
  const POLLING_INTERVAL = 4000;
  // given
  let fakeApi = new FakeSoopBroadcasterApiImpl(() => [
    new SoopLiveDetectorApiDto('jake', 'https://live.com/1'),
    new SoopLiveDetectorApiDto('sara', 'https://live.com/2'),
    new SoopLiveDetectorApiDto('doe', 'https://live.com/3'),
    new SoopLiveDetectorApiDto('john', null),
    new SoopLiveDetectorApiDto('jane', null),
  ]);
  const fakeWatcherProvider = new FakeSoopChatWatcherProvider();
  const watcherManager = new InMemorySoopChatWatcherManager(fakeWatcherProvider);
  const managingTask = new ChatWatcherManagingTask(watcherManager, fakeApi);

  // when
  managingTask.run();
  await sleep(POLLING_INTERVAL);

  // then
  expect(watcherManager.getActiveWatchingList()).toEqual(['jake', 'sara', 'doe']);

  // given
  log.debug('---------------------------------------');
  log.debug('|        데이터 교체 후 확인           |');
  log.debug('---------------------------------------');
  fakeApi.changeSupplier(() => [
    new SoopLiveDetectorApiDto('jake', null),
    new SoopLiveDetectorApiDto('sara', null),
    new SoopLiveDetectorApiDto('doe', 'https://live.com/3'),
    new SoopLiveDetectorApiDto('john', 'https://live.com/4'),
    new SoopLiveDetectorApiDto('jane', null),
    new SoopLiveDetectorApiDto('park', 'https://live.com/5'),
  ]);

  // when
  managingTask.run();
  await sleep(POLLING_INTERVAL);

  // then
  expect(watcherManager.getActiveWatchingList()).toEqual(['doe', 'john', 'park']);
});
