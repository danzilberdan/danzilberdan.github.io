importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBPq24_mICDA2ZKgDwG6nxDWtcFkrzIlo4",
  authDomain: "blog-ba65c.firebaseapp.com",
  projectId: "blog-ba65c",
  storageBucket: "blog-ba65c.appspot.com",
  messagingSenderId: "870065325045",
  appId: "1:870065325045:web:8988fc00ae630fc9c056bc",
  measurementId: "G-PV6ZD4J667"
};

const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging()
