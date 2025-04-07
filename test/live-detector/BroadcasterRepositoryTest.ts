import { GetDBConnection } from '@live-detector/storage/InMemoryDatabase';
import { Broadcaster, BroadcasterRepository } from '@live-detector/storage/BroadcasterRepository';
import { log } from '@common/logger';
import { expect, test } from 'bun:test';

test('BroadcasterRepository should find broadcaster by id', () => {
  const connection = GetDBConnection();
  try {
    // given
    const broadcasterRepository = new BroadcasterRepository(connection);
    const newBroadcaster: Broadcaster = new Broadcaster(null, 'Gamst', null);
    const savedId = broadcasterRepository.insert(newBroadcaster);
    log.debug('saving Broadcaster', JSON.stringify(newBroadcaster));

    // when
    const savedBroadcaster = broadcasterRepository.findById(savedId);
    log.debug('saved Broadcaster', JSON.stringify(savedBroadcaster));

    // then
    expect(savedBroadcaster).not.toBeNull();
    expect(savedBroadcaster?.broadcaster_name).toBe('Gamst');
    expect(savedBroadcaster?.live_url).toBeNull();
    expect(savedBroadcaster?.isLive()).toBe(false);

    // clean up
    broadcasterRepository.delete(savedBroadcaster!);
    const deletedBroadcaster = broadcasterRepository.findById(savedId);
    expect(deletedBroadcaster).toBeNull();
  } finally {
    connection.close();
  }
});

test('BroadcasterRepository should update broadcaster correctly', () => {
  const connection = GetDBConnection();
  try {
    // given
    const broadcasterRepository = new BroadcasterRepository(connection);
    const newBroadcaster: Broadcaster = new Broadcaster(null, 'Gamst', null);
    const savedId = broadcasterRepository.insert(newBroadcaster);
    log.debug('saving Broadcaster', JSON.stringify(newBroadcaster));
    const savedBroadcaster = broadcasterRepository.findById(savedId);
    log.debug('saved Broadcaster', JSON.stringify(savedBroadcaster));
    expect(savedBroadcaster).not.toBeNull();
    expect(savedBroadcaster?.broadcaster_name).toBe('Gamst');
    expect(savedBroadcaster?.live_url).toBeNull();
    expect(savedBroadcaster?.isLive()).toBe(false);

    // when
    savedBroadcaster!.live_url = 'https://www.twitch.tv/gamst';
    broadcasterRepository.update(savedBroadcaster!);
    log.debug('updating Broadcaster', JSON.stringify(savedBroadcaster!));
    const updatedBroadcasterFromRepo = broadcasterRepository.findById(savedId);
    log.debug('updated Broadcaster', JSON.stringify(updatedBroadcasterFromRepo));

    // then
    expect(updatedBroadcasterFromRepo).not.toBeNull();
    expect(updatedBroadcasterFromRepo?.broadcaster_name).toBe('Gamst');
    expect(updatedBroadcasterFromRepo?.live_url).toBe('https://www.twitch.tv/gamst');
    expect(updatedBroadcasterFromRepo?.isLive()).toBe(true);

    // clean up
    broadcasterRepository.delete(updatedBroadcasterFromRepo!);
    const deletedBroadcaster = broadcasterRepository.findById(savedId);
    expect(deletedBroadcaster).toBeNull();
  } finally {
    connection.close();
  }
});
