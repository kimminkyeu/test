import { Database } from 'bun:sqlite';
import { log } from '@common/logger';

function GetDBConnection(): Database {
  log.info('Getting InMemory DB Connection...');
  return new Database(':memory:');
}

const InMemoryDBConnection = GetDBConnection();

export { InMemoryDBConnection, GetDBConnection };
