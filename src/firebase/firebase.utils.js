import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
        apiKey: "AIzaSyD83pcMmuo6cgC9rbBwgzht2moq88ACDlI",
        authDomain: "crwn-db-50362.firebaseapp.com",
        databaseURL: "https://crwn-db-50362.firebaseio.com",
        projectId: "crwn-db-50362",
        storageBucket: "",
        messagingSenderId: "1052842781783",
        appId: "1:1052842781783:web:78127c70a36a3d2eb80712"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ promt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
