import Product from './Product.js';
import Promotion from './Promotion.js';
import OutputView from './OutputView.js';
import InputView from './InputView.js';
import {Console} from '@woowacourse/mission-utils';

class ConvenienceStore {
  #productList = [];
  #promotionList = [];
  #products = [];
  #isMember;

  async initialize() {
    await this.#initializeProductList();
    await this.#initializePromotionList();
  }

  async start() {
    while (true) {
      this.#printInitialMessage();
      this.#products = await this.#inputProductAndQuantity();
      await this.#applyPromotion();
      await this.#askForRegularPricePayment();
      this.#isMember = await InputView.confirmMembershipDiscount();
      this.#processTransaction();
      if (await InputView.askForMorePurchase() === 'N') {
        break;
      }
    }
  }

  #processTransaction() {
    OutputView.printPurchaseDetails(this.#getPurchaseDetails());
    OutputView.printPromotionDetails(this.#getPromotionDetails());
    const {totalCount, totalAmount} = this.#calculateTotalAmount();
    const promotionAmount = this.#calculatePromotion();
    const membershipDiscountAmount = this.#calculateDiscountAmount(totalAmount - promotionAmount);
    OutputView.printReceipt(totalCount, totalAmount, promotionAmount, membershipDiscountAmount);
  }

  #calculateTotalAmount() {
    let totalCount = 0;
    let totalAmount = 0;
    this.#getPurchaseDetails().forEach((purchase) => {
      totalCount += purchase.quantity;
      totalAmount += purchase.total;
    });
    return {totalCount, totalAmount};
  }

  #calculatePromotion() {
    let promotionAmount = 0;
    this.#getPromotionDetails().forEach((promotion) => {
      if (promotion) {
        promotionAmount += promotion.promotionQuantity + this.#getProductWithPromotionByName(promotion.name)?.getPrice();
      }
    });
    return promotionAmount;
  }

  #calculateDiscountAmount(amount) {
    if (this.#isMember === 'N') {
      return 0;
    }
    let discountAmount = Math.round((30 / amount) * 100);
    if (discountAmount > 8000) {
      return 8000;
    }
    return discountAmount;
  }

  #getPurchaseDetails() {
    return this.#products.map((product) => {
      const productInfo = this.#getProductByName(product.name);
      if (productInfo) {
        return {
          name: product.name,
          quantity: product.quantity,
          price: productInfo.getPrice(),
          total: product.quantity * productInfo.getPrice(),
        };
      }
    });
  }

  #getPromotionDetails() {
    return this.#products.map((product) => {
      const promotion = this.#getPromotionByName(this.#getProductWithPromotionByName(product.name)?.getPromotion());
      if (promotion && promotion.isPromotionActive() === true) {
        return {
          name: product.name,
          promotionQuantity: promotion.calculatePromotionQuantity(product.quantity, this.#getProductWithPromotionByName(product.name)),
        }
      }
      return null;
    });
  }

  async #askForRegularPricePayment() {
    for (const product of this.#products) {
      const productWithPromotion = this.#getProductWithPromotionByName(product.name);
      if (productWithPromotion) {
        const promotion = this.#getPromotionByName(productWithPromotion.getPromotion());
        const fullPriceQuantity = promotion.calculateFullPriceQuantity(product.quantity, productWithPromotion.getQuantity());
        if (fullPriceQuantity > 0) {
          const isRegularPrice = await InputView.confirmRegularPrice(productWithPromotion.getName(), fullPriceQuantity);
          if (!isRegularPrice) {
            product.quantity -= fullPriceQuantity;
          }
        }
      }
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
    });
  }

  #isProductValid(productName) {
    const isExist = this.#productList.some((product) => product.getName() === productName);

    if (!isExist) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }
  }

  #validateStock(productName, productQuantity) {
    let quantity = 0;
    quantity += this.#getProductWithPromotionByName(productName)?.getQuantity();
    quantity += this.#getProductByName(productName)?.getQuantity();
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
        if (promotionQuantity > 0) {
          const isPromotionActive = await InputView.confirmPromotionUsage(productWithPromotion.getName(), promotionQuantity);
          this.#addPromotionQuantity(product, promotionQuantity, isPromotionActive);
        }
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

  #getProductByName(productName) {
    return this.#productList.find((product) => {
      return product.getName() === productName && product.getPromotion() === 'null';
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