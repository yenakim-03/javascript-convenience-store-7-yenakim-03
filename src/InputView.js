import fs from 'fs';
import { Console } from '@woowacourse/mission-utils';

class InputView {
  static readList(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const products = this.parseDataToObject(data);
        resolve(products);
      });
    });
  }

  static parseDataToObject(data) {
    const lines = data.trim().split('\n');
    const keys = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return keys.reduce((obj, key, index) => {
        obj[key.trim()] = values[index].trim();
        return obj;
      }, {});
    });
  }

  static async inputProductAndQuantity() {
    while (true) {
      try {
        const input = await Console.readLineAsync('\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n');
        this.validateProductAndQuantity(input);
        return this.parseProductAndQuantity(input);
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  static validateProductAndQuantity(input) {
    const pattern = /\[([^,]+)-(\d+)\]/;

    input.split(',').forEach((item) => {
      if (!pattern.test(item)) {
        throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
      }
    });
  }

  static parseProductAndQuantity(input) {
    const data = [];
    const pattern = /\[([^,]+)-(\d+)\]/;
    input.split(',').forEach((item) => {
      const name = item.match(pattern)[1];
      const quantity = item.match(pattern)[2];
      data.push({'name': name, 'quantity': Number(quantity)});
    });
    return data;
  }

  static async confirmPromotionUsage(productName, quantity) {
    while (true) {
      try {
        const input = await Console.readLineAsync(`현재 ${productName}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);
        this.validateYesNoInput(input);
        return input;
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  static async confirmRegularPrice(productName, quantity) {
    while (true) {
      try {
        const input = await Console.readLineAsync(`현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);
        this.validateYesNoInput(input);
        return input;
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  static async confirmMembershipDiscount() {
    while (true) {
      try {
        const input = await Console.readLineAsync('멤버십 할인을 받으시겠습니까? (Y/N)\n');
        this.validateYesNoInput(input);
        return input;
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  static async askForMorePurchase() {
    while (true) {
      try {
        const input = await Console.readLineAsync('감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n');
        this.validateYesNoInput(input);
        return input;
      } catch (error) {
        Console.print(error.message);
      }
    }
  }

  static validateYesNoInput(input) {
    if (input !== 'Y' && input !== 'N') {
      throw new Error('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
    }
  }
}

export default InputView;