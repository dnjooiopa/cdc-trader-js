const config = {
  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,
  MQTT_HOST: process.env.MQTT_HOST,
  MQTT_PORT: process.env.MQTT_PASSWORD,
  API_KEY: process.env.API_KEY,
  SECRET: process.env.SECRET
};

module.exports.config = config;