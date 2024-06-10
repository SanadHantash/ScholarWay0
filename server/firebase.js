const admin = require('firebase-admin');
const serviceAccount = require('./privatekey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'scholarway-21a50.appspot.com',
});

const storage = admin.storage();

module.exports = { admin, storage };
