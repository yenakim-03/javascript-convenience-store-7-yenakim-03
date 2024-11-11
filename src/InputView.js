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
        const input = await Console.readLineAsync('\n[구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n');
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
    const pattern = /\[([^,]+)-(\d)\]/;
    input.split(',').forEach((item) => {
      const name = item.match(pattern)[1];
      const quantity = item.match(pattern)[2];
      data.push({'name': name, 'quantity': quantity});
    });
    return data;
  }
}

export default InputView;