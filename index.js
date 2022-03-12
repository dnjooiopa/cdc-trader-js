const mqtt = require('mqtt');
const { config } = require('./config');
const { Trader } = require('./trader');

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: 'mqtts',
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD
};

const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('🟢 Connected to MQTT host');
});

client.on('error', (error) => {
  console.log(error);
});

client.on('disconnect', () => {
  console.log('🔴 Disconnected from MQTT host');
});

client.on('reconnect', () => {
  console.log('🟡 Reconnecting to MQTT host');
});

client.subscribe('cdc/signal');

client.on('message', async function (topic, message) {
  console.log('------------------------------------------------');
  console.log('✅ Message received');
  console.log('Time:', new Date());
  try {
    console.log('Data:', topic, message.toString());
    signals = JSON.parse(message.toString());

    const trader = new Trader(config.API_KEY, config.SECRET);
    await trader.update();

    for (const signal of signals) {
      try {
        if (signal['order'] === 'sell') {
          const coinName = signal['asset_name'].toUpperCase();

          if (!trader.checkIfCoinExists(coinName)) {
            continue;
          }

          const pairName = signal['pair_name'].toUpperCase();
          const symbol = `${coinName}/${pairName}`;

          const coinValue = await trader.getValue(symbol);
          if (coinValue <= 10) {
            continue;
          }

          const amount = trader.getAmount(coinName);
          result = await trader.sell(symbol, amount);
          console.log(`🟢 Successfully ${result['info']['side']} ${result['info']['symbol']} : ${result['info']['cummulativeQuoteQty']}$`);
        }
      } catch (err) {
        console.log('🔴 Trading error:', err.message);
      }
    }



  } catch (err) {
    console.log('🔴 Could not initialize trader:', err.message);
  }


});