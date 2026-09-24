'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignIn from '@/components/sign-in/sign-in.component';
import SignUp from '@/components/sign-up/sign-up.component';
import { useUser } from '@/contexts/user.context';
import { SignInAndSignUpContainer } from './sign-in-and-sign-up.styles';

const SignInAndSignUpPage = () => {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.replace('/');
  }, [currentUser, router]);

  return (
    <SignInAndSignUpContainer>
      <SignIn />
      <SignUp />
    </SignInAndSignUpContainer>
  );
};

export default SignInAndSignUpPage;
