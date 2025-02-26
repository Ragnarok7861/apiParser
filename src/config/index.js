module.exports = {
  selectors: {
    region: {
      button: 'div[class*="Region_region__"]',
      text: 'div[class*="Region_region__"] > span:nth-of-type(2)',
      modal: '//div[contains(text(), "Выберите ваш регион")]',
    },
    product: {
      // Акционная цена (если есть)
      priceNew: 'span[class*="Price_role_discount"]',
      // Обычная цена (если нет скидки)
      priceRegular:
        'span[class^="Price_price"]:not([class*="role_old"], [class*="role_discount"])',
      // Старая (зачеркнутая) цена
      priceOld: 'span[class*="role_old"]',

      // Рейтинг
      rating: 'a[class^="ActionsRow_stars"]',
      // Количество отзывов
      reviewCount: 'a[class^="ActionsRow_reviews"]',
    },
  },
  patterns: {
    productUrl: /^https:\/\/www\.vprok\.ru\/product\/.+/i,
    categoryUrl: /^https:\/\/www\.vprok\.ru\/catalog\/\d+\/.+/i,
  },
};
