import { Redis } from "ioredis";
import RedisMock from "ioredis-mock";

let redisClient: Redis;

if (process.env.NODE_ENV !== "test") {
  redisClient = new Redis("redis://redis:6379");
} else {
  redisClient = new RedisMock({ data: {} });
}

export default redisClient;
