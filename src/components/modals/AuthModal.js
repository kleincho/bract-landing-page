import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import googleIcon from './icons8-google.svg';

function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Welcome to HUMINT</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
