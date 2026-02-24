import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ()=> {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = ()=> {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <h1 className="text-[#667eea] text-[1.8rem] font-bold">
          WORKOUT TRACKER
        </h1>
        <nav className="flex items-center gap-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/exercises">Exercises</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/workouts">Workouts</Link>

          {isAdmin && <Link to="/admin/users">Users (Admin)</Link>}
          <span className="text-[#667eea]">
            👤 {user?.name}
            </span>
            
          <button className="bg-transparent border-0 text-[#e74c3c] font-medium cursor-pointer text-base"
          onClick={handleLogout}>
            Logout
            </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
