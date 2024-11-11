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
    this.#start_date = start_date;
    this.#end_date = end_date;
  }

  getName() {
    return this.#name;
  }

  calculateAdditionalQuantity(orderQuantity, productQuantity) {
    if (!this.#isPromotionActive() || orderQuantity % (this.#buy + this.#get) === 0) {
      return 0;
    }
    const additionalQuantity= (this.#buy + this.#get) - orderQuantity % (this.#buy + this.#get);
    if (additionalQuantity > productQuantity) {
      return 0;
    }
    return additionalQuantity;
  }

  #isPromotionActive() {
    const now = Date.now();
    return now >= this.#start_date && now <= this.#end_date;
  }
}

export default Promotion;