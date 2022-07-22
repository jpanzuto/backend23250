import yargs from "yargs/yargs";
import dotenv from "dotenv";
dotenv.config();

const { puerto, modo } = yargs(process.argv.slice(2)).argv;

const PORT = Number(process.argv[2]);
const MODO = process.argv[3];

export default {
  PORT: PORT || process.env.PORT,
  MODO_PERSISTENCIA: process.env.MODO_PERSISTENCIA || "mongodb",
  CNX_STR: process.env.CNX_STR,
  MONGO_BASE: process.env.MONGO_BASE,
  NODE_ENV: process.env.NODE_ENV || "development",
  MODO: MODO || process.env.MODO || "CLUSTER",
};
