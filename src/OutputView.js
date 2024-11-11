import { Console } from '@woowacourse/mission-utils';

class OutputView {
  static printWelcomeMessage() {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
  }

  static printProduct(product) {
    const name = product.getName();
    const price = this.formatPrice(product.getPrice());
    const quantity = this.formatQuantity(product.getQuantity());
    const promotion = this.formatPromotion(product.getPromotion());

    Console.print(`- ${name} ${price} ${quantity} ${promotion}`);
  }

  static formatPrice(price) {
    return price.toLocaleString() + '원';
  }

  static formatQuantity(quantity) {
    if (quantity > 0) {
      return `${quantity}개`;
    } else {
      return '재고 없음';
    }
  }

  static formatPromotion(promotion) {
    if (promotion === 'null') {
      return '';
    } else {
      return promotion;
    }
  }
}

export default OutputView;