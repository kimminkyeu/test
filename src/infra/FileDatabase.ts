import Database from 'bun:sqlite';

function FileDatabase(): Database {
  return new Database('./sqlite/broadcaster.db');
}

export default FileDatabase;
