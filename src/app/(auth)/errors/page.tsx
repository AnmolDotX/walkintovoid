// src/app/(main)/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
const ErrorCard = ({ title, message, backTo }: { title: string; message: string; backTo: string }) => {
  return (
    <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-400">{title}</h1>
        <p className="mt-2 text-gray-300">{message}</p>
      </div>
      <Button asChild className="w-full">
        <Link href={backTo}>Try Again</Link>
      </Button>
    </div>
  );
};

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: { title: string; message: string } } = {
    CredentialsSignin: {
      title: 'Invalid Credentials',
      message: 'The email or password you entered is incorrect. Please try again.',
    },
    OAuthAccountNotLinked: {
      title: 'Email Already in Use',
      message: 'This email is already linked to an account. Please sign in with the original method you used.',
    },
  };

  let title = 'Authentication Error';
  let message = 'An unknown error occurred. Please try again.';

  if (error) {
    if (errorMessages[error]) {
      title = errorMessages[error].title;
      message = errorMessages[error].message;
    } else {
      title = 'Authentication Failed';
      message = error;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <ErrorCard title={title} message={message} backTo="/signin" />
    </div>
  );
};

export default AuthErrorPage;
