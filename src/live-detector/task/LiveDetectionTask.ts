import { log } from '@common/logger';
import { Runnable } from '@common/schedular';

import { InMemoryDBConnection } from '@live-detector/storage/InMemoryDatabase';
import SoopLiveDetector from '@live-detector/internal/SoopLiveDetector';
import { Broadcaster, BroadcasterRepository } from '@live-detector/storage/BroadcasterRepository';

class SoopLiveDetectionTask implements Runnable {
  private readonly detector: SoopLiveDetector;

  constructor() {
    this.detector = new SoopLiveDetector();
  }

  public async run() {
    log.debug('Creating connection');
    const broadcasterRepository = new BroadcasterRepository(InMemoryDBConnection);
    for (const broadcaster of broadcasterRepository.findAll()) {
      broadcaster.live_url = await this.getLiveUrlOf(broadcaster);
      broadcasterRepository.update(broadcaster); // update live url (null if not live)
    }
  }

  // Helper method -----------------------------------------

  private async getLiveUrlOf(broadcaster: Broadcaster): Promise<string | null> {
    try {
      const liveUrl = await this.detector.getLiveUrl(broadcaster.broadcaster_name);
      log.info(`Broadcaster ${broadcaster.broadcaster_name} is live!: ${liveUrl}`);
      return liveUrl;
    } catch (e) {
      return null;
    }
  }
}

export { SoopLiveDetectionTask };
