import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/apiservices';
import photoPath from "../../assets/2.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      const response = await authService.login(formData);
      
      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect based on user role
      if (response.user.role === 'banker') {
        navigate('/banker/dashboard');
      } else if (response.user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        throw new Error('Invalid user role');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      // Clear any existing auth data on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F0F4FA] min-h-screen rounded-3xl flex items-center justify-center p-6">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side Photo */}
        <div className="w-1/2 flex rounded-3xl items-center justify-center">
          <img
            src={photoPath}
            alt="Side Visual"
            className="w-full rounded-3xl h-full object-cover"
          />
        </div>

        {/* Middle Spacer */}
        <div className="w-[30px] bg-[#F0F4FA]"></div>

        {/* Right Side Form */}
        <div className="w-full rounded-3xl md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#72A1CD]">
            Sign in to your account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#72A1CD] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#72A1CD] focus:border-transparent"
                style={{ WebkitAppearance: 'none' }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="text-[#72A1CD] hover:text-[#5f90bc]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#72A1CD] hover:bg-[#5f90bc] text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-[#72A1CD] hover:text-[#5f90bc] font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 