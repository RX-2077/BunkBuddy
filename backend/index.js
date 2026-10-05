const { healthCheck } = require('./src/api/healthCheck');
const { onUserCreated } = require('./src/triggers/userTriggers');

// Export all functions so Firebase can deploy them
module.exports = {
  // HTTP Endpoints
  healthCheck,
  
  // Firestore Triggers
  onUserCreated,
};
