class Promotion {
  #name;
  #buy;
  #get;
  #start_date;
  #end_date;

  constructor(name, buy, get, start_date, end_date) {
    this.#name = name;
    this.#buy = buy;
    this.#get = get;
    this.#start_date = new Date(start_date);
    this.#end_date = new Date(end_date);
  }

  getName() {
    return this.#name;
  }

  calculateAdditionalQuantity(orderQuantity, productQuantity) {
    if (!this.isPromotionActive() || orderQuantity % (this.#buy + this.#get) === 0) {
      return 0;
    }
    const additionalQuantity= (this.#buy + this.#get) - orderQuantity % (this.#buy + this.#get);
    if (additionalQuantity > productQuantity || Math.floor(orderQuantity / this.#buy) < 1) {
      return 0;
    }
    return additionalQuantity;
  }

  isPromotionActive() {
    const now = new Date();
    return (now >= this.#start_date) && (now <= this.#end_date);
  }

  calculateFullPriceQuantity(orderQuantity, productQuantity) {
    if (productQuantity >= orderQuantity) {
      return 0;
    }
    const count= Math.floor(orderQuantity / (this.#buy + this.#get));
    for (let i = count; i > 0; i--) {
      if (productQuantity >= i * (this.#buy + this.#get)) {
        return orderQuantity - i * (this.#buy + this.#get);
      }
    }
  }

  calculatePromotionQuantity(orderQuantity, product) {
    let count = Math.floor(orderQuantity / this.#buy);
    if (this.#buy === 1) {
      count--;
    }
    for (let i = count; i > 0; i--) {
      if (product.getQuantity() >= i * (this.#buy + this.#get)) {
        return i;
      }
    }
    return 0;
  }
}

export default Promotion;