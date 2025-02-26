const FileService = require('../services/FileService');

/**
 * Абстрактный базовый класс для всех парсеров
 * Запрещает прямое создание экземпляров
 * Реализует общую логику для всех наследников
 */
class Parser {
  constructor() {
    if (new.target === Parser) {
      throw new Error('Нельзя создать экземпляр абстрактного класса');
    }

    // Инициализация сервиса работы с файлами
    this.fileService = new FileService();
  }

  /**
   * Основной метод парсинга
   * @async
   */
  async parse() {
    throw new Error('Метод parse() реализован в дочернем классе');
  }

  /**
   * Валидация URL по регулярному выражению
   * @param {string} url - Проверяемый URL
   * @param {RegExp} pattern - Регулярное выражение для проверки
   * @throws {Error} Если URL не соответствует паттерну
   */
  validateUrl(url, pattern) {
    const regex = new RegExp(pattern);
    if (!regex.test(url)) {
      throw new Error(`Некорректный формат URL: ${url}`);
    }
  }
}

module.exports = Parser;
