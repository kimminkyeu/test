import log from '@/lib/logger';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const api = new Hono();

api.use('*', logger(log.printFn.bind(log)));

api.get('/', c => {
  return c.text('Hello World!');
});

export default api;
