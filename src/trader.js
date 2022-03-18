const ccxt = require('ccxt');

class Trader {
  #binance;
  #balance;
  #orders;

  constructor(apiKey, secret) {
    this.#binance = new ccxt.binance({
      options: {
        adjustForTimeDifference: true,
      },
      enableRateLimit: true, apiKey, secret
    });
    this.#balance = {};
    this.#orders = {};
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

  getTotalAmount(name) {
    return this.#balance[name]['total'];
  }

  getFreeAmount(name) {
    return this.#balance[name]['free'];
  }

  getUsedAmount(name) {
    return this.#balance[name]['used'];
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

  checkIfCoinExists(name) {
    return name in this.#balance;
  }

  async getOpenOrders(symbol) {
    return await this.#binance.fetchOpenOrders(symbol);
  }

}

module.exports = Trader;