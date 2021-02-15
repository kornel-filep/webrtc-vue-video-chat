import firebase from 'firebase';

let firebaseConfig = process.env.CI ? require('./config/db-ci') : require('./config/db-local');

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();
