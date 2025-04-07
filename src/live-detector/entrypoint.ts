import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { log } from '@common/logger';
import { Schedular } from '@common/schedular';

import { SoopLiveDetectionTask } from '@live-detector/task/LiveDetectionTask';
import { Broadcaster, BroadcasterRepository } from '@live-detector/storage/BroadcasterRepository';
import { InMemoryDBConnection } from '@live-detector/storage/InMemoryDatabase';

import broadcasterInfoListJson from '@root/broadcaster.json';

/**
 *
 */
function initDatabase() {
  InMemoryDBConnection.exec(`
      CREATE TABLE IF NOT EXISTS broadcaster (
          broadcaster_name VARCHAR(500) UNIQUE NOT NULL,
          live_url VARCHAR(500)
      );
  `);
  const tableInfo = InMemoryDBConnection.query(`PRAGMA table_info('broadcaster')`).all();
  log.info('broadcaster 테이블 정보:', tableInfo);

  broadcasterInfoListJson.forEach(broadcasterInfo => {
    new BroadcasterRepository(InMemoryDBConnection).insert(
      new Broadcaster(null, broadcasterInfo.name, null)
    );
  });
}
initDatabase();

/**
 *
 */
new Schedular()
  .register({
    name: 'SOOP 방송이 시작되었는지 확인',
    cronExpr: '0 * * * * *', // every 1 minutes
    task: new SoopLiveDetectionTask(),
  })
  .startSchedule();

/**
 *
 */
const api = new Hono();
api.use('*', logger(log.printFn.bind(log)));
/**
 * 현재 방송중인 방송인 리스트
 */
api.get('/live', c => {
  const broadcasterRepository = new BroadcasterRepository(InMemoryDBConnection);
  const list = broadcasterRepository.findByOnLive().map(broadcaster => {
    return {
      name: broadcaster.broadcaster_name,
      live_url: broadcaster.live_url,
    };
  });
  return c.json(list);
});
/**
 * 추적중인 방송인 리스트
 */
api.get('/', c => {
  const broadcasterRepository = new BroadcasterRepository(InMemoryDBConnection);
  const list = broadcasterRepository.findAll().map(broadcaster => {
    return {
      name: broadcaster.broadcaster_name,
      isLive: broadcaster.isLive(),
    };
  });
  return c.json(list);
});

export default {
  port: 3000,
  fetch: api.fetch, // application entry point
};
