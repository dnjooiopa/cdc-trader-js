const Trader = require('../src/trader');
const config = require('../src/config');

(async () => {
  const trader = new Trader(config.API_KEY, config.SECRET);
  await trader.update();

  console.log('🧪 Trader.fetchOrder');
  console.log('total:', trader.getTotalAmount('KNC'));
  console.log('free:', trader.getFreeAmount('KNC'));
  console.log('used:', trader.getUsedAmount('KNC'));

  console.log('🧪 Trader.getOrderBook');
  const btcOpenOrders = await trader.getOpenOrders('BTC/BUSD');
  btcOpenOrders.map(btcOpenOrders);
})();




