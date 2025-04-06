import { Hono } from 'hono';
import { chromium, Browser, Page } from 'playwright';

const app = new Hono();

export class WebCrawler {
    private browser: Browser | null = null;
    private page: Page | null = null;

    /**
     * Initialize the browser and create a new page
     */
    async initialize(): Promise<void> {
        this.browser = await chromium.launch({
            headless: false, // Set to true for headless mode
        });
        this.page = await this.browser.newPage();
    }

    /**
     * Navigate to Naver.com
     */
    async navigateToNaver(): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not initialized. Call initialize() first.');
        }

        await this.page.goto('https://www.naver.com');
        console.log('Navigated to Naver.com');
    }

    /**
     * extract chat list inview
     */
    async takeScreenshot(path: string): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not initialized. Call initialize() first.');
        }

        await this.page.screenshot({ path });
        console.log(`Screenshot saved to ${path}`);
    }

    /**
     * Close the browser
     */
    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}

// Example usage
async function main() {
    const crawler = new WebCrawler();

    try {
        await crawler.initialize();
        await crawler.navigateToNaver();
        await crawler.takeScreenshot('naver-homepage.png');

        // Wait for a few seconds to see the page
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await crawler.close();
    }
}

// Run the crawler if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
