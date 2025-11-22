const admin = require('firebase-admin');

// Initialize the Firebase app with the service account
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});

// Define the notification message
const message = {
  token: '<FCM_TOKEN>',  // Replace with the recipient's FCM token
  notification: {
    title: 'Hello!',
    body: 'This is a test notification from Firebase!',
  },
  // You can also add custom data if needed:
  data: {
    customKey: 'customValue'
  },
};

// Send the notification
admin.messaging().send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });
