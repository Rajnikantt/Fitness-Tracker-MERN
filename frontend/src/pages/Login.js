import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ()=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e)=> {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center text-[#667eea] mb-8 text-2xl">
          Login
          </h2>
        {error && <div className="error">{error}
          </div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Email
            </label> 
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"/>
          </div>


          <button className="btn btn-primary w-full mb-4"
            type="submit"
            disabled={loading}>
            {loading ? 'Logging you in...' : 'Login'}
          </button>
        </form>

        
      <p className="text-center text-[#666]">
           Don't have an account?{" "}
           <Link to="/register" className="text-[#667eea] font-semibold">
            Register here
         </Link>
           </p>



        <div className='mt-8 p-4 bg-[#f8f9fa] rounded-[5px] text-[0.9rem]'>
          <strong className=' flex justify-center'>
            Demo Accounts:
            </strong>
            <div className='flex justify-center'>
              Admin: admin@iron.com / admin123<br/>
              User: john@example.com / password123
            </div>    
        </div>
      </div>
    </div>
  );
};

export default Login;
