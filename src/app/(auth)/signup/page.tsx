// src/app/(main)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SignUpPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 for details, 2 for OTP

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send OTP');
      }

      setStep(2); // Move to OTP verification step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Automatically sign in the user after successful verification
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Verification successful, but failed to sign in. Please go to the sign-in page.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-md">
        {step === 1 ? (
          <>
            <h1 className="text-center text-2xl font-bold">Create an Account</h1>
            <form onSubmit={handleSendOtp} className="space-y-4">
              {error && <p className="text-center text-red-500">{error}</p>}
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded border border-gray-600 bg-gray-700 p-2"
                />
              </div>
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
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl font-bold">Verify Your Email</h1>
            <p className="text-center text-gray-300">A 6-digit code was sent to {email}</p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {error && <p className="text-center text-red-500">{error}</p>}
              <div>
                <label htmlFor="otp">Verification Code</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="mt-1 w-full rounded border border-gray-600 bg-gray-700 p-2"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Verifying...' : 'Create Account'}
              </Button>
            </form>
          </>
        )}
        <p className="text-center">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
