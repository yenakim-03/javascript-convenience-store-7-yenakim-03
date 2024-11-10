import InputView from './InputView.js';
import Product from './Product.js';
import Promotion from './Promotion.js';

class ConvenienceStore {
  #productList = [];
  #promotionList = [];

  async initialize() {
    await this.#initializeProductList();
    await this.#initializePromotionList();
  }

  async #initializeProductList() {
    const products = await InputView.readList('./public/products.md');

    products.forEach((product) => {
      const data = new Product(product.name, Number(product.price), Number(product.quantity), product.promotion);
      this.#productList.push(data);
    });
  }

  async #initializePromotionList() {
    const promotions = await InputView.readList('./public/promotions.md');

    promotions.forEach((promotion) => {
      const data = new Promotion(promotion.name, Number(promotion.buy), Number(promotion.get), new Date(promotion.start_date), new Date(promotion.end_date));
      this.#promotionList.push(data);
    });
  }
}

export default ConvenienceStore;