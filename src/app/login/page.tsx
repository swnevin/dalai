'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RiddleModal from '../../components/RiddleModal';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRiddle, setShowRiddle] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add your login logic here
      router.push('/admin');
    } catch (error) {
      setError('Feil brukernavn eller passord');
    }
  };

  const handleRiddleSuccess = () => {
    // Add your password reset logic here
    alert('En e-post med tilbakestilling av passord er sendt');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-montserrat font-bold text-primary">
            Logg inn
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Brukernavn
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Passord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowRiddle(true)}
              className="text-sm font-medium text-primary hover:text-primary-light"
            >
              Glemt passord?
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Logg inn
            </button>
          </div>
        </form>
      </div>

      <RiddleModal
        isOpen={showRiddle}
        onClose={() => setShowRiddle(false)}
        onSuccess={handleRiddleSuccess}
      />
    </div>
  );
}
