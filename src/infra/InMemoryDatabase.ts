import { Database } from 'bun:sqlite';
import log from '@/lib/logger';

function InMemoryDatabase() {
  log.info('inMemory DB를 생성합니다.');
  const db = new Database(':memory:');
  db.exec(`
      CREATE TABLE IF NOT EXISTS broadcaster (
          broadcaster_name VARCHAR(500) UNIQUE NOT NULL,
          live_url VARCHAR(500)
      );
  `);
  return db;
}

export default InMemoryDatabase;
