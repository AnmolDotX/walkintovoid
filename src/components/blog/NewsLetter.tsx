'use client';
import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8 backdrop-blur-sm">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
            <h3 className="mb-2 text-2xl font-bold text-white">Welcome to the Journey!</h3>
            <p className="text-gray-400">
              You&apos;ve successfully subscribed to our newsletter. Prepare to explore the void with us.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8 backdrop-blur-sm lg:p-12">
          <div className="mb-8 text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
              <Mail className="h-8 w-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Join the{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Void</span>
            </h2>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-400">
              Subscribe to our newsletter and embark on a journey into the unknown. Get the latest insights, stories,
              and contemplations delivered directly to your inbox.
            </p>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-full border border-gray-600 bg-gray-900/50 px-4 py-4 text-white placeholder-gray-400 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex transform items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Subscribe
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <p className="mt-6 text-center text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time. No spam, just pure void.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
