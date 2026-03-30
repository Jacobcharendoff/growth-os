'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-900 mb-3">
          Something went wrong
        </h1>

        <p className="text-center text-slate-600 mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>

        <button
          onClick={reset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>

        <button
          onClick={() => window.location.href = '/'}
          className="w-full mt-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
