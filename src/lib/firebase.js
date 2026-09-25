import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Firebase web config is public by design; override per environment with NEXT_PUBLIC_FIREBASE_* vars.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD83pcMmuo6cgC9rbBwgzht2moq88ACDlI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'crwn-db-50362.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'crwn-db-50362',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1052842781783',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1052842781783:web:78127c70a36a3d2eb80712'
};

const app = getApps().find(app => app.name === '[DEFAULT]') ?? initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return null;

  const userRef = doc(firestore, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email } = userAuth;
    await setDoc(userRef, {
      displayName,
      email,
      createdAt: new Date(),
      ...additionalData
    });
  } else if (additionalData) {
    await setDoc(userRef, additionalData, { merge: true });
  }

  return userRef;
};

export const getUserProfile = async (userAuth, additionalData) => {
  const userRef = await createUserProfileDocument(userAuth, additionalData);
  const snapshot = await getDoc(userRef);
  return { id: snapshot.id, ...snapshot.data() };
};

export const onAuthChange = callback => onAuthStateChanged(auth, callback);
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);
