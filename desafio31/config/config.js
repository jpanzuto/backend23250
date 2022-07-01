const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  urlMongo: process.env.URLMONGO,
  NODE_ENV: process.env.NODE_ENV || "development",
  NODE_ENV: "development",
};
