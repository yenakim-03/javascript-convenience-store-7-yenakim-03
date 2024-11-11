import Product from './Product.js';
import Promotion from './Promotion.js';
import OutputView from './OutputView.js';
import InputView from './InputView.js';
import {Console} from '@woowacourse/mission-utils';

class ConvenienceStore {
  #productList = [];
  #promotionList = [];
  #products = []

  async initialize() {
    await this.#initializeProductList();
    await this.#initializePromotionList();
  }

  async start() {
    while (true) {
      this.#printInitialMessage();
      this.#products = await this.#inputProductAndQuantity();
      await this.#applyPromotion();
      break;
    }
  }

  #printInitialMessage() {
    OutputView.printWelcomeMessage();
    this.#productList.forEach(product => {
      OutputView.printProduct(product);
    });
  }

  async #inputProductAndQuantity() {
    while (true) {
      try {
        const products = await InputView.inputProductAndQuantity();
        this.#validateProductAndQuantity(products);
        return products;
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  #validateProductAndQuantity(products) {
    products.forEach((product) => {
      this.#isProductValid(product.name);
      this.#validateStock(product.name, product.quantity);
    })
  }

  #isProductValid(productName) {
    const isExist = this.#productList.some((product) => product.getName() === productName);

    if (!isExist) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }
  }

  #validateStock(productName, productQuantity) {
    let quantity = 0;
    this.#productList.forEach((product) => {
      if (product.getName() === productName) {
        quantity += product.getQuantity();
      }
    });
    if (productQuantity > quantity) {
      throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
    }
  }

  async #applyPromotion() {
    for (const product of this.#products) {
      const productWithPromotion = this.#getProductWithPromotionByName(product.name);
      if (productWithPromotion) {
        const promotion = this.#getPromotionByName(productWithPromotion.getPromotion());
        const promotionQuantity = promotion.calculateAdditionalQuantity(product.quantity, productWithPromotion.getQuantity());
        const isPromotionActive = await InputView.confirmPromotionUsage(productWithPromotion.getName(), promotionQuantity);
        this.#addPromotionQuantity(product, promotionQuantity, isPromotionActive);
      }
    }
  }

  #addPromotionQuantity(product, promotionQuantity, isPromotionActive) {
    if (isPromotionActive) {
      product.quantity += promotionQuantity;
    }
  }

  #getProductWithPromotionByName(productName) {
    return this.#productList.find((product) => {
      return product.getName() === productName && product.getPromotion() !== 'null';
    }) || null;
  }

  #getPromotionByName(promotionName) {
    return this.#promotionList.find((promotion) => {
      return promotionName === promotion.getName();
    }) || null;
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