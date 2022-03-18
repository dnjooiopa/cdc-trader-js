const mqtt = require('mqtt');
const config = require('./config');
const Trader = require('./trader');
const { log } = require('./util');

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: 'mqtts',
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD
};

const client = mqtt.connect(options);

client.on('connect', () => {
  log('🟢 Connected to MQTT host');
});

client.on('error', (error) => {
  console.log(getLocaleString(), ': 🔴 MQTT error:', error.message);
  log(`🔴 MQTT error: ${error.message}`);
});

client.on('disconnect', () => {
  log('🔴 Disconnected from MQTT host');
});

client.on('reconnect', () => {
  log('🟡 Reconnecting to MQTT host');
});

client.subscribe('cdc/signal');

client.on('message', async function (topic, message) {
  log('✅ Message received');
  try {
    console.log(`${topic} : ${message.toString()}`);
    signals = JSON.parse(message.toString());

    const trader = new Trader(config.API_KEY, config.SECRET);
    await trader.update();

    for (const signal of signals) {
      try {
        if (signal['order'] === 'sell') {
          const coinName = signal['name'].toUpperCase();

          if (!trader.checkIfCoinExists(coinName)) {
            continue;
          }

          const pairName = signal['pair'].toUpperCase();
          const symbol = `${coinName}/${pairName}`;

          const price = await trader.getPrice(symbol);

          const usedValue = price * trader.getUsedAmount(coinName);
          if (usedValue >= 10) {
            const openOrders = await trader.getOpenOrders(symbol);
            const cancels = openOrders.map(o => trader.cancelOrder(o.id, symbol));
            await Promise.all(cancels);
          }

          const coinValue = price * trader.getTotalAmount(coinName);
          if (coinValue <= 10) {
            continue;
          }

          const amount = trader.getTotalAmount(coinName);
          result = await trader.sell(symbol, amount);
          log(`🟢 Successfully ${result['info']['side']} ${result['info']['symbol']} : ${result['info']['cummulativeQuoteQty']}$`);
        }
      } catch (err) {
        log('🔴 Trading error:', err);
      }
    }
    await trader.update();
  } catch (err) {
    log('🔴 Could not initialize trader:', err.message);
  }
});