const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const PuppeteerParser = require('./src/parsers/PuppeteerParser');

// Добавляем плагин для обхода защиты
puppeteer.use(StealthPlugin());

// Обработка аргументов
const [, , productUrl, region] = process.argv;
if (!productUrl || !region) {
  console.log('Использование: node puppeteer.js <URL_товара> "<Регион>"');
  console.log(
    'Пример: node puppeteer.js "https://vprok.ru/product/123" "Москва"'
  );
  process.exit(1);
}

(async () => {
  try {
    // Создаем парсер
    const parser = new PuppeteerParser(productUrl, region);

    // Запускаем парсинг
    await parser.parse();

    console.log('✅ Данные успешно сохранены!');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
})();
