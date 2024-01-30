const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.secret.json');

const url = 'https://danzilberdan.github.io/testing-for-network-failures/'
const payload = {
    notification: {
      title: 'Testing for Network Failures',
      body: 'Port Forwarding for Testing Network Failures',
    //   imageUrl: undefined,
    },
    data: {
      link: url,
    },
    webpush: {
      fcmOptions: {
        link: url,
      },
    },
  };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin.messaging().send({
  topic: 'general',
  data: payload.data,
  webpush: payload.webpush,
  notification: payload.notification,
})
  .then((response) => {
    console.log('Notification sent successfully:', response);
  });
