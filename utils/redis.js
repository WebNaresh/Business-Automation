const { createClient } = require("redis");

class RedisClient {
  constructor() {
    console.log("RedisClient constructor called");
    this.client = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        reconnectStrategy: function (times) {
          console.log(`Reconnecting to Redis... Attempt ${times}`);
          var delay = Math.min(times * 50, 2000);
          return delay;
        },
      },
    });

    this.client.on("ready", () => {
      console.log("Ready to Redis");
    });

    this.client.on("error", (err) => {
      console.error(`Redis Error: ${err}`);
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });

    this.client.on("reconnecting", () => {
      console.log("Reconnecting to Redis...");
    });

    console.log(
      `🚀 ~ file: redis.js:11 ~ RedisClient ~ process.env.REDIS_PASSWORD:`,
      process.env.REDIS_PASSWORD
    );
    console.log(
      `🚀 ~ file: redis.js:11 ~ RedisClient ~ process.env.REDIS_PORT:`,
      process.env.REDIS_PORT
    );
  }

  set(key, value, callback) {
    this.client.set(key, value, callback);
  }

  async get(key) {
    return this.client.get(key);
  }

  quit() {
    this.client.quit();
  }
}

const redisClient = new RedisClient();
module.exports = { RedisClient, redisClient };
