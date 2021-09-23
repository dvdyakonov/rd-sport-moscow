importScripts("https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBoIgv_xC50vO3TsP3z7ZX74VHrLo4vNVY",
  projectId: "qrntn-app",
  messagingSenderId: "361036704066",
  appId: "1:361036704066:web:0c93b106b72eeef11000db",
});

const messaging = firebase.messaging();
