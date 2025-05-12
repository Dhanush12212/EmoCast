import React, { useState } from 'react';
import { Icon } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Icon className="absolute left-3 top-3">email</Icon>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-gray-300"
              required
            />
          </div>
          <div className="relative">
            <Icon className="absolute left-3 top-3">lock</Icon>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-gray-300"
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
