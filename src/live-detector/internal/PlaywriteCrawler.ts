import { Browser, Page } from 'playwright';
import { chromium, PlaywrightBrowserLauncher } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { log } from '@common/logger';

type LaunchOption = Parameters<PlaywrightBrowserLauncher['launch']>;

interface Crawler<K> {
  afterBrowserLoad<V>(crawlingAction: (page: K) => V): Promise<V>;
}

class PlaywriteCrawler implements Crawler<Page> {
  private browser?: Browser;
  private readonly args: LaunchOption;

  public constructor(...args: LaunchOption) {
    this.args = args;
  }
  /**
   * 페이지 로드 후 콜백을 실행하고 결과를 반환하는 제네릭 메서드
   * @param fn 페이지 객체를 받아 작업을 수행하고 T 타입의 결과를 반환하는 콜백 함수
   * @returns 콜백 함수의 결과값 (타입 T)
   */
  public async afterBrowserLoad<T>(crawlingAction: (page: Page) => T) {
    try {
      this.browser = await this.lauchBrowser();
      const page = await this.browser.newPage();
      return await crawlingAction.apply(this, [page]);
    } finally {
      this.browser && (await this.closeBrowser(this.browser));
    }
  }

  /**
   * Helper function to launch browser with stealth plugin
   */
  private async lauchBrowser() {
    log.info('Launching browser...');
    chromium.use(StealthPlugin());
    return await chromium.launch(...this.args);
  }

  /**
   * Helper function to close browser safely
   */
  private async closeBrowser(browser: Browser | null) {
    log.info('Closing browser...');
    browser && (await browser.close());
  }
}

export default PlaywriteCrawler;
