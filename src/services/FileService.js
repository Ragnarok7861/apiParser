const fs = require('fs');
const path = require('path');

/**
 * Сервис для работы с файловой системой
 * Отвечает за сохранение данных на диск
 */
class FileService {
  /**
   * Конструктор класса
   * @param {string} outputDir - Путь к папке для сохранения файлов (по умолчанию 'output')
   */
  constructor(outputDir = 'output') {
    // Абсолютный путь к папке вывода
    this.outputDir = path.resolve(__dirname, '../../', outputDir);

    // Создание папки, если её нет
    this.createOutputDir();
  }

  /**
   * Создаёт папку для сохранения файлов
   * @private
   */
  createOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`[FileService] Создана папка: ${this.outputDir}`);
    }
  }

  /**
   * Сохраняет скриншот в формате JPG
   * @param {Buffer} buffer - Бинарные данные изображения
   */
  saveScreenshot(buffer) {
    const filePath = path.join(this.outputDir, 'screenshot.jpg');
    fs.writeFileSync(filePath, buffer);
    console.log(`[FileService] Скриншот сохранён: ${filePath}`);
  }

  /**
   * Сохраняет данные о товаре в текстовый файл
   * @param {object} data - Данные о товаре
   * @param {string} data.price - Цена
   * @param {string} data.priceOld - Старая цена
   * @param {string} data.rating - Рейтинг
   * @param {string} data.reviewCount - Количество отзывов
   */
  saveProductData(data) {
    const content = [
      `price=${data.price}`,
      `priceOld=${data.priceOld}`,
      `rating=${data.rating}`,
      `reviewCount=${data.reviewCount}`,
    ].join('\n');

    this._saveFile('product.txt', content);
  }

  /**
   * Внутренний метод для записи файла
   * @param {string} filename - Имя файла
   * @param {string} content - Содержимое файла
   * @private
   */
  _saveFile(filename, content) {
    const filePath = path.join(this.outputDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`[FileService] Данные сохранены в: ${filePath}`);
  }
}

module.exports = FileService;
