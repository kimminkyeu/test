import { Database } from 'bun:sqlite';
import log from '@/common/logger';

function initDatabase() {
  const info = scanDatabase();
  if (0 < info.length) {
    log.info('broadcaster 테이블이 이미 존재합니다.');
    return;
  }

  log.info('broadcaster 테이블이 존재하지 않습니다.');
  createDatabase();
}

function scanDatabase(): any[] {
  const db = new Database('./sqlite/broadcaster.db');

  try {
    const tableInfo = db.query(`PRAGMA table_info('broadcaster')`).all();
    log.info('Broadcaster 테이블 정보:', tableInfo);
    return tableInfo;
  } finally {
    db.close();
  }
}

function createDatabase() {
  log.info('broadcaster 테이블을 생성합니다.');
  const db = new Database('./sqlite/broadcaster.db', { create: true });

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS broadcaster (
          broadcaster_name VARCHAR(500) UNIQUE NOT NULL,
          live_url VARCHAR(500)
      );
  `);
  } finally {
    db.close();
  }
}

export default initDatabase;
