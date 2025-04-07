import { Schedular } from '@common/schedular';
import { ChatWatcherManagingTask } from '@chat-watcher/task/ChatWatcherManagingTask';
import { SoopBroadcasterApiImpl } from './internal/SoopBroadcasterApi';
import { InMemorySoopChatWatcherManager } from './internal/SoopChatWatcherManager';
import { DefaultSoopChatWatcherProvider } from './task/ChatWatchTask';
import { log } from '@common/logger';

const watcherProvider = new DefaultSoopChatWatcherProvider();

const watcherManager = new InMemorySoopChatWatcherManager(watcherProvider);

const broadcasterApi = new SoopBroadcasterApiImpl('http://localhost:3000');

new Schedular()
  .register({
    name: '시작된 방송은 감시를 시작하고, 종료된 방송은 감시를 종료한다.',
    cronExpr: '0 * * * * *', // every 1 minutes
    task: new ChatWatcherManagingTask(watcherManager, broadcasterApi),
  })
  .startSchedule();

log.info('라이브 방송에 대한 채팅 감시 시작');
