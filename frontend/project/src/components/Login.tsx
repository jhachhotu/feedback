import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg p-8 border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Sign in to FeedbackFlow</h2>
          <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm text-center">{error}</div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {/* Arrow icon below the login button */}
          <div className="flex justify-center mt-4">
            <LogIn className="h-7 w-7 text-blue-600 animate-bounce" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;