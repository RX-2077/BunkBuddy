const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

exports.onUserCreated = onDocumentCreated("users/{userId}", (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    return;
  }
  const newUser = snapshot.data();
  logger.info(`New user profile created for ${newUser.name || event.params.userId}`);
});
