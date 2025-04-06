import PlaywriteCrawler from '@/service/crawler/PlaywriteCrawler';
import Crawler from '@/service/crawler/PlaywriteCrawler';
import DetectionFailureError from '@/service/detector/LiveDetectorError';
import log from '@/lib/logger';
/**
 *
 */

interface SoopLiveDetection {
  /**
   * 방송중일 경우 해당 방송의 URL을 반환합니다.
   * @throws {Error} 방송중이 아닐 경우거나, 획득에 실패한 경우
   */
  getLiveUrl: (broadcasterId: string) => Promise<string>;
}

class SoopLiveDetector implements SoopLiveDetection {
  private readonly crawler: Crawler = new PlaywriteCrawler({ headless: true });
  private readonly SOUP_LIVE: string = 'https://play.sooplive.co.kr';

  public async getLiveUrl(broadcasterId: string): Promise<string> {
    return this.crawler.afterBrowserLoad(async page => {
      // 1. soup live 페이지 이동
      const initialUrl = `${this.SOUP_LIVE}/${broadcasterId}`;
      await page.goto(initialUrl, { waitUntil: 'load' });

      // 2. 페이지 로드 후 URL 확인
      if (!page.url().startsWith(initialUrl)) {
        throw new DetectionFailureError(page.url());
      }

      const roomId = page.url().substring(initialUrl.length + 1);
      if (roomId.length <= 0) {
        throw new DetectionFailureError(page.url());
      }

      if (roomId.includes('null')) {
        throw new DetectionFailureError(page.url());
      }

      return page.url();
    });
  }
}

export default SoopLiveDetector;
