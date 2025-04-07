import { Schedular } from '@common/schedular';
import { ChatWatcherManagingTask } from '@chat-watcher/task/ChatWatcherManagingTask';

/**
 *
 */
new Schedular()
  .register({
    name: '시작된 방송은 감시를 시작하고, 종료된 방송은 감시를 종료한다.',
    cronExpr: '0 * * * * *', // every 1 minutes
    task: new ChatWatcherManagingTask(),
  })
  .startSchedule();
