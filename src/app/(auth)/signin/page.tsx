// src/app/(main)/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false, // Important: handle redirect manually
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    } else {
      // Successful sign-in, redirect to the callbackUrl
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold">Sign In</h1>
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          {error && <p className="text-center text-red-500">{error}</p>}
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-600 bg-gray-700 p-2"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-600 bg-gray-700 p-2"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing In...' : 'Sign In with Credentials'}
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>
        <Button onClick={handleGoogleSignIn} disabled={isLoading} variant="outline" className="w-full">
          {/* You can add a Google icon here */}
          Sign In with Google
        </Button>
        <p className="text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
