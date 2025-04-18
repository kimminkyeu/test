import { SoopBroadcasterApi } from '@chat-watcher/internal/SoopBroadcasterApi';
import { SoopChatWatcherManager } from '@chat-watcher/internal/SoopChatWatcherManager';
import { log } from '@common/logger';
import { Runnable } from '@common/schedular';

/**
    - (1) `class ChatWatcherManager` : 방송 감청 관리자 + `스케쥴`
    - 책임 : 현재 방송중인 방들을 대상으로 `감시 프로세스`을 1대1로 켠다.
    - 이 친구는 감시 프로세스가 잘 돌고 있는지 체크하고 관리하는 책임을 진다.
        - 감청 대상을 조율하기 위해 sqlite를 조회한다.
    - 관리 규칙
        - 현재 방송중이 아닌데 감청 프로세스가 켜져 있으면 강제 종료시킨다.
        - 현재 방송중인데 감청을 안하고 있으면 다시 킨다.
 */
class ChatWatcherManagingTask implements Runnable {
  private readonly watcherManager: SoopChatWatcherManager;
  private readonly broadcasterApi: SoopBroadcasterApi;

  constructor(watcherManager: SoopChatWatcherManager, broadcasterApi: SoopBroadcasterApi) {
    this.watcherManager = watcherManager;
    this.broadcasterApi = broadcasterApi;
  }

  public async run() {
    log.debug('ChatWatcherManagingTask : run()');

    for (const broadcaster of await this.broadcasterApi.getAll()) {
      log.debug(`ChatWatcherManagingTask : BJ[${broadcaster.name}/${broadcaster.liveUrl}]`);

      if (broadcaster.isLive() && !this.watcherManager.isWatching(broadcaster.name)) {
        this.watcherManager.startWatching(broadcaster.name, broadcaster.liveUrl!);
        continue;
      }

      if (!broadcaster.isLive()) {
        this.watcherManager.stopWatching(broadcaster.name);
        continue;
      }
    }
  }
}

export { ChatWatcherManagingTask };
