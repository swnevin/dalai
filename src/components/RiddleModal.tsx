'use client';

import { useState } from 'react';

interface RiddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RiddleModal({ isOpen, onClose, onSuccess }: RiddleModalProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.toLowerCase().trim() === 'schøningsdal') {
      onSuccess();
      onClose();
    } else {
      setError('Feil svar, prøv igjen');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-auto">
        <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-primary mb-4">
          Gåte
        </h2>
        <p className="text-gray-600 mb-6">
          Hva er Dalai oppkalt etter?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Skriv ditt svar her"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
