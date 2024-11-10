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
}

export default Promotion;