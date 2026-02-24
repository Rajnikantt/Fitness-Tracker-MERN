import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ()=> {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e)=> {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
     else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center text-[#667eea] mb-8 text-2xl">
          Register
          </h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Name
              </label>
            <input
              type="text"
              value={name}
              onChange={ (e)=> setName(e.target.value)}
              required
              placeholder="Your name"/>
          </div>

          <div className="form-group">
            <label>
              Email
              </label>
            <input
              type="email"
              value={email}
              onChange={ (e)=> setEmail(e.target.value)}
              required
              placeholder="Enter your email"/>
          </div>

          <div className="form-group">
            <label>
              Password
              </label>
            <input
              type="password"
              value={password}
              onChange={ (e)=> setPassword(e.target.value)}
              required
              placeholder="••••••••"/>
          </div>

          <div className="form-group">
            <label>
              Confirm Password
              </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={ (e)=> setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary w-full mb-4"
            type="submit"
            disabled={loading}  >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-[#666]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#667eea] font-semibold" >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
