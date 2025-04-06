import { Database } from 'bun:sqlite';
import { Broadcaster, BroadcasterRepository } from '@/infra/BroadcasterRepository';
import FileDatabase from '@/infra/FileDatabase';
import SoopLiveDetector from '@/service/detector/SoopLiveDetector';
import log from '@/lib/logger';

class LiveDetectorService {
  private readonly detector: SoopLiveDetector;

  constructor() {
    this.detector = new SoopLiveDetector();
  }

  public detectionTask(): void {
    const connection = FileDatabase();
    const broadcasterRepository = new BroadcasterRepository(connection);
    try {
      broadcasterRepository.findAll().forEach(async broadcaster => {
        broadcaster.live_url = await this.getLiveUrlWrapper(broadcaster);
        broadcasterRepository.update(broadcaster); // update live url (null if not live)
      });
    } finally {
      connection.close();
    }
  }

  private async getLiveUrlWrapper(broadcaster: Broadcaster) {
    try {
      const liveUrl = await this.detector.getLiveUrl(broadcaster.broadcaster_name);
      log.info(`Broadcaster ${broadcaster.broadcaster_name} is live!: ${liveUrl}`);
      return liveUrl;
    } catch (e) {
      return null;
    }
  }
}

export default LiveDetectorService;
