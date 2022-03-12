const mqtt = require('mqtt');
const { config } = require('./config');

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: 'mqtts',
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD
};


const client = mqtt.connect(options);

client.on('connect', function () {
  console.log('Connected');
});

client.on('error', function (error) {
  console.log(error);
});

client.on('message', function (topic, message) {
  console.log('Received message:', topic, message.toString());
});

client.subscribe('cdc/signal');