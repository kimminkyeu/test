import { SoopChatWatcherProvider, StoppableTask } from '@chat-watcher/task/ChatWatchTask';
import { log } from '@common/logger';

type BjName = string;

interface SoopChatWatcherManager {
  startWatching: (bjName: string, liveUrl: string) => void;
  stopWatching: (bjName: string) => void;
  isWatching: (bjName: string) => boolean;
  getActiveWatchingList: () => BjName[]; // get list of currently watching BJ names
}

class InMemorySoopChatWatcherManager implements SoopChatWatcherManager {
  private chatWatcherProvider: SoopChatWatcherProvider;
  private chatWatchers: Map<BjName, StoppableTask>;

  constructor(chatWatcherProvider: SoopChatWatcherProvider) {
    this.chatWatcherProvider = chatWatcherProvider;
    this.chatWatchers = new Map();
  }

  // NOTE: watcherTask는 별도 쓰레드 혹은 프로세스에서 실행시킬 것.

  // 멱등적 작동
  public startWatching(bjName: string, liveUrl: string): void {
    log.debug(`SoopChatWatcherManager: Start watching ${bjName} (${liveUrl})`);

    this.chatWatchers.get(bjName)?.stop(); // clean up old watcher
    const watcher = this.chatWatcherProvider.createWatcher(bjName, liveUrl, chat => {
      // TODO: 여기에 필요한 로직 추가
      log.trace(`[${bjName}] ${chat}`);
    });
    this.chatWatchers.set(bjName, watcher);
    watcher.start();
  }

  // 멱등적 작동
  public stopWatching(bjName: string): void {
    log.debug(`SoopChatWatcherManager: Stop watching ${bjName}`);

    this.chatWatchers.get(bjName)?.stop();
    this.chatWatchers.delete(bjName);
  }

  public isWatching(bjName: string): boolean {
    return this.chatWatchers.has(bjName);
  }

  public getActiveWatchingList(): BjName[] {
    return Array.from(this.chatWatchers.keys());
  }
}

export { SoopChatWatcherManager, InMemorySoopChatWatcherManager };
