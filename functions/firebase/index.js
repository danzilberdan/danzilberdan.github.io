const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.secret.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const firebaseToken = requestBody.firebaseToken;
    await admin.messaging().subscribeToTopic(firebaseToken, 'general');

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Firebase token added to FCM topic "general" successfully' }),
    };

    return response;
  } catch (error) {
    console.error('Error:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };

    return response;
  }
};
