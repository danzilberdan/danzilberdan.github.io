import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyBPq24_mICDA2ZKgDwG6nxDWtcFkrzIlo4",
    authDomain: "blog-ba65c.firebaseapp.com",
    projectId: "blog-ba65c",
    storageBucket: "blog-ba65c.appspot.com",
    messagingSenderId: "870065325045",
    appId: "1:870065325045:web:8988fc00ae630fc9c056bc",
    measurementId: "G-PV6ZD4J667"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

self.addEventListener('push', event => {
  const options = {};

  self.registration.showNotification('Title', options);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
});

getToken(messaging)
  .then(token => {
    console.log('FCM Token:', token);
  })
  .catch(error => {
    console.error('Error getting FCM token:', error);
  });