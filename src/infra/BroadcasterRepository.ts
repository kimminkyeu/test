import log from '@/lib/logger';
import { Database } from 'bun:sqlite';

/**
 * TODO: sqlite connection pool 부분 참고.
 * 일단 가장 간단한 형태로 구현 (사용시 커넥션 생성)
 * 아래 코드는 커넥션을 매 Respository Instance 마다 생성하는 형태
 */

class Broadcaster {
  public rowid: number | null;
  public broadcaster_name: string;
  public live_url: string | null;

  constructor(rowid: number | null, name: string, liveUrl: string | null) {
    this.rowid = rowid;
    this.broadcaster_name = name;
    this.live_url = liveUrl;
  }

  public isLive(): boolean {
    if (this.live_url === null) {
      return false;
    }
    if (this.live_url.length <= 0) {
      return false;
    }
    return true;
  }
}

class BroadcasterRepository {
  private db: Database;

  constructor(connection: Database) {
    this.db = connection;
  }

  public findById(id: number): Broadcaster | null {
    const statement = 'SELECT *, ROWID FROM broadcaster WHERE ROWID = ?';
    log.trace(statement);
    return this.db.query(statement).as(Broadcaster).get(id);
  }

  public findAll(): Broadcaster[] {
    const statement = 'SELECT *, ROWID FROM broadcaster';
    log.trace(statement);
    return this.db.query(statement).as(Broadcaster).all();
  }

  public findByName(name: string): Broadcaster | null {
    const statement = 'SELECT * FROM broadcaster WHERE broadcaster_name = ?';
    log.trace(statement);
    return this.db.query(statement).as(Broadcaster).get(name);
  }

  public update(broadcaster: Broadcaster): void {
    const statement = 'UPDATE broadcaster SET live_url = ? WHERE ROWID = ?';
    log.trace(statement);
    this.db.prepare(statement).run(broadcaster.live_url, broadcaster.rowid);
  }

  public delete(broadcaster: Broadcaster): void {
    const statement = 'DELETE FROM broadcaster WHERE ROWID = ?';
    log.trace(statement);
    this.db.prepare(statement).run(broadcaster.rowid);
  }

  public insert(broadcaster: Broadcaster): number {
    const statement = 'INSERT INTO broadcaster (broadcaster_name, live_url) VALUES (?, ?)';
    log.trace(statement);
    const change = this.db
      .prepare(statement)
      .run(broadcaster.broadcaster_name, broadcaster.live_url);
    return Number(change.lastInsertRowid);
  }
}

export { BroadcasterRepository, Broadcaster };
