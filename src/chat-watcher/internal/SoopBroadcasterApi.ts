import { SoopLiveDetectorApiDto } from '@common/SoopLiveDetectorApiResponse';

interface SoopBroadcasterApi {
  /**
   * 현재 추적중인 모든 Soop 방송인 목록 획득
   */
  getAll(): Promise<SoopLiveDetectorApiDto[]>;
}

class SoopBroadcasterApiImpl implements SoopBroadcasterApi {
  /**
   * 요청 대상 주소 (live-detector server)
   */
  private readonly apiUrl: string;

  public constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getAll(): Promise<SoopLiveDetectorApiDto[]> {
    const response = await fetch(this.apiUrl, { method: 'GET' });
    const body = (await response.json()) as { name: string; liveUrl: string }[];
    return body.map(bd => new SoopLiveDetectorApiDto(bd.name, bd.liveUrl));
  }
}

export { SoopBroadcasterApiImpl, SoopBroadcasterApi };
