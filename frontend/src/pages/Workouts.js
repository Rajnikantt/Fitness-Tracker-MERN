import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Workouts = ()=> {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( ()=> {
    loadWorkouts();
  }, []);

  const loadWorkouts = async ()=> {
    try {
      const response = await axios.get('/api/workouts?limit=50');
      setWorkouts(response.data);
    }
     catch (error) {
      console.error('Error loading workouts:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id)=> {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${id}`);
        loadWorkouts();
      } 
      catch (error) {
        alert('Error deleting workout');
      }
    }
  };

  const calculateTotalVolume = (workout)=> {
    let total = 0;
    workout.exercises?.forEach(exercise => {
      exercise.sets?.forEach(set => {
        total += set.weight * set.reps;
      });
    });
    return Math.round(total);
  };

  if (loading) {
    return <div className="loading">
      Loading workouts...
      </div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Workout History
            </h2>
          <Link to="/workouts/create" className="btn btn-primary">
            ➕ Log Workout
          </Link>
        </div>

        {workouts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {workouts.map(workout => (
              <div className="workout-card bg-[#f8f9fa] p-4 rounded-lg shadow-sm"
                key={workout._id} >
                  
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="mb-1">
                      {new Date(workout.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'})}
                        </h3>

                    <p className="text-[#666] text-sm">
                      {workout.exercises?.length || 0}
                      exercises •
                       {calculateTotalVolume(workout)}
                        lbs total volume
                    </p>
                  </div>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={ ()=> handleDelete(workout._id)}
                  >
                    Delete
                  </button>
                </div>

                {workout.notes && (
                  <p className="text-gray-600 text-sm mb-4 italic">
                    📝 {workout.notes}
                  </p>
                )}

                {/* Exercises */}
                <div className="flex flex-col gap-3">
                  {workout.exercises?.map((exercise, index )=> (
                    <div key={index} className="bg-white p-3 rounded-md">

                      <h4 className="text-sm font-medium mb-1">
                        {exercise.exercise?.name || 'Unknown Exercise'}
                      </h4>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {exercise.sets?.map((set, setIndex )=> (
                          <span key={setIndex} className="bg-[#667eea] text-white py-1 px-3 rounded-full">
                            Set
                             {set.setNo}: {set.reps}
                              × 
                             {set.weight}
                              lbs
                            {set.rpe && ` @ RPE ${set.rpe}`}
                          </span>
                        ))}

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>) : (
          <p className="text-center text-gray-600 p-8">
            No workouts logged yet. Start tracking your progress!
          </p>
        )}
      </div>
    </div>
  );
};

export default Workouts;
