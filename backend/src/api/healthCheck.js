const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.healthCheck = onRequest((request, response) => {
  logger.info("Health check pinged!");
  response.send({ status: "ok", message: "BunkBuddy API is running!" });
});
