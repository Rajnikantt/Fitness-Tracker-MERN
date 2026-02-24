import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = ()=> {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect( ()=> {
    loadStats();
  }, []);

  const loadStats = async ()=> {
    try {
      const response = await axios.get('/api/workouts/stats/summary');
      setStats(response.data);
    }
     catch (error) {
      console.error('Error loading stats:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">
      Loading dashboard...
      </div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600 mt-2">
          Track your fitness journey with Workout Tracker
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>
            {stats?.totalWorkouts || 0}
            </h3>
          <p>
            Total Workouts
            </p>
        </div>

        <div className="stat-card">
          <h3>
            {stats?.totalExercises || 0}
            </h3>
          <p>
            Total Exercises
            </p>
        </div>

        <div className="stat-card">
          <h3>
            {stats?.totalSets || 0}
            </h3>
          <p>
            Total Sets
            </p>
        </div>

        <div className="stat-card">
          <h3>
            {stats?.totalVolume ? Math.round(stats.totalVolume) : 0}
            </h3>
          <p>
            Total Volume (kg)
            </p>
        </div>
      </div>


      <div className="grid grid-2">
        <div className="card">
          <h2>
            Quick Actions
            </h2>
          <div className="flex flex-col gap-4 mt-4">
            <Link to="/workouts/create" className="btn btn-primary">
              📝 Log Workout
            </Link>

            <Link to="/programs/create" className="btn btn-secondary">
              ➕ Create Program
            </Link>

            <Link to="/programs" className="btn btn-secondary">
              📋 Browse Programs
            </Link>
          </div>
        </div>

        <div className="card">
          <h2>
            Recent Workouts
            </h2>
          {stats?.recentWorkouts && stats.recentWorkouts.length > 0 ? (
            <div className="mt-4">
              {stats.recentWorkouts.map((workout, index)=> (
                <div className="p-3 bg-[#f8f9fa] rounded-[5px] mb-2"
                  key={index}>

                  <div className="flex justify-between">
                    <span>
                    {new Date(workout.date).toLocaleDateString()}
                    </span>

                    <span className="text-[#667eea] font-semibold">
                      {workout.exerciseCount}
                      exercises
                    </span>
                  </div>
                </div>
              ))}
            </div>
            ) : (
            <p className="text-gray-600 mt-4">
              No workouts yet. Start logging your first workout!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
