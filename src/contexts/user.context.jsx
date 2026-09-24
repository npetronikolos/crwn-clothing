'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthChange,
  getUserProfile,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser
} from '@/lib/firebase';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(
    () =>
      onAuthChange(async userAuth => {
        if (!userAuth) {
          setCurrentUser(null);
          return;
        }
        try {
          setCurrentUser(await getUserProfile(userAuth));
        } catch (error) {
          console.error('Could not load user profile', error);
        }
      }),
    []
  );

  const value = useMemo(
    () => ({
      currentUser,
      googleSignIn: () => signInWithGoogle(),
      emailSignIn: (email, password) => signInWithEmail(email, password),
      signUp: async ({ email, password, displayName }) => {
        const { user } = await signUpWithEmail(email, password);
        setCurrentUser(await getUserProfile(user, { displayName }));
      },
      signOut: () => signOutUser()
    }),
    [currentUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside <UserProvider>');
  return context;
};
