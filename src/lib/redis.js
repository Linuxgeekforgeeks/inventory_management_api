import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  url: "https://good-shrimp-48617.upstash.io", 
  token: "Ab3pAAIncDFmOTFjNmI5M2ZjOWM0YTE1YjY3MmZkYjI0N2Q3MWM1M3AxNDg2MTc",
});

export default redis;

