import { Console } from '@woowacourse/mission-utils';

class Product {
  #name;
  #price;
  #quantity;
  #promotion;

  constructor(name, price, quantity, promotion) {
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;
    this.#promotion = promotion;
  }

  printStock() {
    const price = this.#formatPrice();
    const quantity = this.#formatQuantity();
    const promotion = this.#formatPromotion();
    Console.print(`- ${this.#name} ${price} ${quantity} ${promotion}`);
  }

  #formatPrice() {
    return this.#price.toLocaleString() + '원';
  }

  #formatQuantity() {
    if (this.#quantity > 0) {
      return `${this.#quantity}개`;
    } else {
      return '재고 없음';
    }
  }

  #formatPromotion() {
    if (this.#promotion === 'null') {
      return '';
    } else {
      return this.#promotion;
    }
  }
}

export default Product;