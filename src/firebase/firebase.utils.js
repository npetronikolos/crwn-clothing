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

export const createUserProfileDocument = async (userAuth, additionalData) => {
        if (!userAuth) return;

        const userRef = firestore.doc(`users/${userAuth.uid}`);

        const snapShot = await userRef.get();

        if (!snapShot.exists) {
                const {displayName, email } = userAuth;
                const createdAt = new Date();

                try {
                        await userRef.set({
                                displayName,
                                email,
                                createdAt,
                                ...additionalData
                        })
                } catch (error) {
                        console.log('error creating user', error.message);
                }
        }

        return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ promt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
