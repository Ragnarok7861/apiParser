const Parser = require('../core/Parser');
const config = require('../config');
const puppeteer = require('puppeteer-extra');

class PuppeteerParser extends Parser {
  constructor(url, region) {
    super();
    this.url = url;
    this.region = region;
    this.browser = null;
    this.page = null;
  }

  async parse() {
    try {
      this.validateUrl(this.url, config.patterns.productUrl);
      await this.initializeBrowser();
      await this.handleRegionSelection();
      await this.captureScreenshot();
      const data = await this.extractProductData();
      this.fileService.saveProductData(data);
    } catch (error) {
      console.error('❌ Ошибка парсинга:', error.message);
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }

  async initializeBrowser() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    this.page = await this.browser.newPage();

    // Настройка User-Agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    );

    // Удаление следов автоматизации
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.goto(this.url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
  }

  async handleRegionSelection() {
    try {
      // Явное ожидание элемента региона
      await this.page.waitForSelector(config.selectors.region.button, {
        timeout: 30000,
        visible: true,
      });

      // Проверка текущего региона
      const currentRegion = await this.page.$eval(
        config.selectors.region.text,
        (el) => el.textContent.trim()
      );

      if (currentRegion !== this.region) {
        // Клик с задержкой для имитации пользователя
        await this.page.click(config.selectors.region.button, { delay: 100 });

        // Ожидание модального окна через XPath
        await this.page.waitForXPath(config.selectors.region.modal, {
          timeout: 30000,
          visible: true,
        });

        // Поиск региона по точному тексту
        const [target] = await this.page.$x(
          `//span[text() = "Санкт-Петербург и область"]`
        );

        if (!target) throw new Error('Регион не найден');
        await target.click();

        // Ожидание полной перезагрузки страницы
        await this.page.waitForNavigation({
          waitUntil: 'networkidle2',
          timeout: 40000,
        });
      }
    } catch (error) {
      // Скриншот для отладки
      await this.page.screenshot({ path: 'region-error.png' });
      throw error;
    }
  }
  async captureScreenshot() {
    const buffer = await this.page.screenshot({ fullPage: true });
    this.fileService.saveScreenshot(buffer);
  }

  async extractProductData() {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Ждем загрузки элементов

    return {
      price: await this._getElementText(
        config.selectors.product.priceNew,
        true,
        true
      ),
      priceOld: await this._getElementText(
        config.selectors.product.priceOld,
        true,
        true
      ),

      rating: await this._getElementText(config.selectors.product.rating, true),
      reviewCount: await this._getElementText(
        config.selectors.product.reviewCount,
        true
      ),
    };
  }

  async _getElementText(selector, optional = false, isPrice = false) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 }); // Явное ожидание
      let text = await this.page.$eval(selector, (el) => el.textContent.trim());

      if (isPrice) {
        text = text.replace(/\s/g, '').replace(',', '.');
      }

      return text;
    } catch (error) {
      console.error(`❌ Ошибка при получении элемента: ${selector}`, error);
      if (!optional) throw new Error(`Элемент не найден: ${selector}`);
      return '';
    }
  }

  async _getElementAttribute(selector, attribute) {
    return this.page.$eval(
      selector,
      (el, attr) => el.getAttribute(attr),
      attribute
    );
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Браузер успешно закрыт');
    }
  }
}

module.exports = PuppeteerParser;
