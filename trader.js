const ccxt = require('ccxt');

class Trader {
  #binance;
  #balance;

  constructor(apiKey, secret) {
    this.#binance = new ccxt.binance({ apiKey, secret });
    this.#balance = {};
  }

  async getBalance() {
    return await this.#binance.fetchBalance();
  }

  async update() {
    this.#balance = await this.getBalance();
  }

  async getPrice(symbol) {
    const ticker = await this.#binance.fetchTicker(symbol);
    return (ticker['bid'] + ticker['ask']) / 2;
  }

  getAmount(name) {
    return this.#balance[name]['total'];
  }

  async getValue(symbol) {
    const price = await this.getPrice(symbol);
    const amount = this.getAmount(symbol.split('/')[0]);
    return price * amount;
  }

  async buy(symbol, amount) {
    return await this.#binance.createMarketOrder(symbol, 'buy', amount);
  }

  async sell(symbol, amount) {
    return await this.#binance.createMarketOrder(symbol, 'sell', amount);
  }

}

module.exports.Trader = Trader;