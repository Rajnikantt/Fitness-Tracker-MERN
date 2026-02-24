import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateWorkout = ()=> {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    exercises: []
  });

  useEffect( ()=> {
    loadExercises();
  }, []);

  const loadExercises = async ()=> {
    try {
      const response = await axios.get('/api/exercises');
      setExercises(response.data);
    } 
    catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const addExercise = ()=> {
    if (exercises.length === 0) return;
    
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        {
          exercise: exercises[0]._id,
          orderNo: formData.exercises.length + 1,
          notes: '',
          sets: [{ setNo: 1, reps: 10, weight: 0, restSeconds: 60, rpe: null }]
        }
      ]
    });
  };

  const removeExercise = (index)=> {
    const newExercises = formData.exercises.filter((_, i)=> i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  const updateExercise = (index, field, value)=> {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData({ ...formData, exercises: newExercises });
  };

  const addSet = (exIndex)=> {
    const newExercises = [...formData.exercises];
    const sets = newExercises[exIndex].sets;
    sets.push({
      setNo: sets.length + 1,
      reps: 10,
      weight: 0,
      restSeconds: 60,
      rpe: null
    });
    setFormData({ ...formData, exercises: newExercises });
  };

  const removeSet = (exIndex, setIndex)=> {
    const newExercises = [...formData.exercises];
    newExercises[exIndex].sets = newExercises[exIndex].sets.filter((_, i)=> i !== setIndex);
    // Renumber sets

    newExercises[exIndex].sets.forEach((set, idx)=> {
      set.setNo = idx + 1;
    });
    setFormData({ ...formData, exercises: newExercises });
  };

  const updateSet = (exIndex, setIndex, field, value)=> {
    const newExercises = [...formData.exercises];
    newExercises[exIndex].sets[setIndex] = {
      ...newExercises[exIndex].sets[setIndex],
      [field]: value
    };
    setFormData({ ...formData, exercises: newExercises });
  };


  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      await axios.post('/api/workouts', formData);
      alert('Workout logged successfully!');
      navigate('/workouts');
    }
     catch (error) {
      console.error('Error creating workout:', error);
      alert('Error logging workout');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>
          Log Workout
          </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label> Date </label>

              <input 
                required
                type="date"
                value={formData.date}
                onChange={ (e)=> setFormData({ ...formData, date: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Workout Notes</label>
            <textarea
              value={formData.notes}
              onChange={ (e)=> setFormData({ ...formData, notes: e.target.value })}
              placeholder="How did you feel? Any observations?"
            />
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3>
                Exercises
                </h3>
              <button className="btn btn-secondary btn-small"
                type="button"
                onClick={addExercise}>
                ➕ Add Exercise
              </button>
            </div>

            {formData.exercises.map((exercise, exIndex)=> (
              <div key={exIndex} className="card bg-[#f8f9fa] mb-4" >
                <div className="flex justify-between items-center mb-4">
                  <h4>
                    Exercise{exIndex + 1}
                    </h4>
                  <button className="btn btn-danger btn-small"
                    type="button"
                    onClick={ ()=> removeExercise(exIndex)}>
                    Remove
                  </button>
                </div>

                <div className="form-group">
                  <label>Select Exercise</label>
                  <select value={exercise.exercise}
                  onChange={(e) => updateExercise(exIndex, 'exercise', e.target.value)}>
                    {exercises.map(ex => (
                      <option key={ex._id}
                       value={ex._id}>
                        {ex.name} ({ex.category} - {ex.equipment})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Exercise Notes</label>
                  <input value={exercise.notes}
                    type="text"
                    onChange={ (e)=> updateExercise(exIndex, 'notes', e.target.value)}
                    placeholder="Optional notes for this exercise"
                  />
                </div>

                <div className="flex justify-between items-center mb-2">
                  <strong>Sets</strong>
                  <button className="btn btn-secondary btn-small"
                    type="button"
                    onClick={ ()=> addSet(exIndex)}>
                    ➕ Add Set
                  </button>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex gap-2 mb-2 items-center" >
                    <span className="min-w-[60px] font-semibold">
                      Set {set.setNo}
                      </span>
                    <input className="flex-1"
                      type="number"
                      inputMode="numeric"
                      placeholder="Reps"
                      value={set.reps === 0 ? "": set.reps}
                      onChange={ (e)=> updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                    />


                    <input className="flex-1"
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      placeholder="Weight"
                      value={set.weight === 0 ? "" : set.weight}
                      onChange={ (e)=> updateSet(exIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                      />


                    <input className="flex-1"
                      type="number"
                      placeholder="Rest (s)"
                      value={set.restSeconds === 0 ? "" : set.restSeconds}
                      onChange={(e) => updateSet(exIndex, setIndex, 'restSeconds', parseInt(e.target.value) || 0)} 
                    />


                    <input className="flex-1 "
                      type="number"
                      min="1"
                      max="10"
                      placeholder="RPE"
                      value={set.rpe || ''}
                      onChange={ (e)=> updateSet(exIndex, setIndex, 'rpe', e.target.value ? parseInt(e.target.value) : null)}
                      />


                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={ ()=> removeSet(exIndex, setIndex)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ))}

            {formData.exercises.length === 0 && (
              <p className="text-center text-[#666] p-8">
                No exercises added yet. Click "Add Exercise" to start.
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="btn btn-primary">
              Log Workout
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={ ()=> navigate('/workouts')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkout;
