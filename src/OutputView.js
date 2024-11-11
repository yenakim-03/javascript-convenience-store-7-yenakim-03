import {Console} from '@woowacourse/mission-utils';

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

  static printPurchaseDetails(products) {
    Console.print('==============W 편의점================');
    Console.print('상품명\t수량	금액');
    products.forEach(product => {
      Console.print(`${product.name}\t${product.quantity} ${product.total.toLocaleString()}`);
    });
  }

  static printPromotionDetails(products) {
    Console.print('=============증 정===============');
    products.forEach((product) => {
      if (product) {
        Console.print(`${product?.name}\t${product?.promotionQuantity}`);
      }
    });
  }

  static printReceipt(totalCount, totalAmount, promotionAmount, membershipDiscountAmount) {
    Console.print('====================================');
    Console.print(`총구매액 ${totalCount} ${totalAmount.toLocaleString()}`);
    Console.print(`행사할인 -${promotionAmount.toLocaleString()}`);
    Console.print(`멤버십할인 -${membershipDiscountAmount.toLocaleString()}`);
    Console.print(`내실돈 ${(totalAmount - promotionAmount - membershipDiscountAmount).toLocaleString()}`);
  }
}

export default OutputView;