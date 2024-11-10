import fs from 'fs';

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
}

export default InputView;