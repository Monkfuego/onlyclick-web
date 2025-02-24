import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState(''); // Changed to phoneNumber
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!phoneNumber) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }
    
    try {
      const payload = { phoneNumber, password }; // Updated payload to use phoneNumber

      const response = await axios.post('https://only-click-six.vercel.app/api/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Store tokens securely
        const { accessToken, refreshToken } = response.data.data;

        Cookies.set('accessToken', accessToken, {
          secure: true,
          sameSite: 'strict',
        });

        Cookies.set('refreshToken', refreshToken, {
          secure: true,
          sameSite: 'strict',
        });

        // Navigate to appropriate dashboard
        if (response.data.data.userProfile.role === 'contractor') {
          navigate('/contractor/home');
        } else if (response.data.data.userProfile.role === 'user') {
          navigate('/user/home');
        } else {
        }
      }
    } catch (error) {
      // Handle specific error scenarios
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError('Invalid login credentials');
            break;
          case 401:
            setError('Unauthorized access');
            break;
          case 404:
            setError('User not found');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel" // Changed to 'tel' for phone input
            id="phoneNumber"
            value={phoneNumber} // Updated to use phoneNumber state
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Logging...' : 'Login'}
        </button>

        {/* Additional Links */}
        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
