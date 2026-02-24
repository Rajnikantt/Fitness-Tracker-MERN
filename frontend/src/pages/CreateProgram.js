import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProgram = ()=> {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'Private',
    days: []
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

  const addDay =()=> {
    setFormData({
      ...formData,
      days: [
        ...formData.days,
        {
          dayNumber: formData.days.length + 1,
          title: `Day ${formData.days.length + 1}`,
          notes: '',
          exercises: []
        }
      ]
    });
  };

  const removeDay = (index)=> {
    const newDays = formData.days.filter((_, i)=> i !== index);
    setFormData({ ...formData, days: newDays });
  };

  const updateDay = (index, field, value)=> {
    const newDays = [...formData.days];
    newDays[index] = { ...newDays[index], [field]: value };
    setFormData({ ...formData, days: newDays });
  };

  const addExercise = (dayIndex)=> {
    const newDays = [...formData.days];
    if (!newDays[dayIndex].exercises) {
      newDays[dayIndex].exercises = [];
    }
    newDays[dayIndex].exercises.push({
      exercise: exercises[0]?._id || '',
      orderNo: newDays[dayIndex].exercises.length + 1,
      trainingStyle: 'Straight Sets',
      notes: '',
      sets: [{ setNo: 1, targetReps: 10, targetWeight: 0, restSeconds: 60 }]
    });
    setFormData({ ...formData, days: newDays });
  };

  const updateExercise = (dayIndex, exIndex, field, value)=> {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exIndex] = {
      ...newDays[dayIndex].exercises[exIndex],
      [field]: value
    };
    setFormData({ ...formData, days: newDays });
  };

  const addSet = (dayIndex, exIndex)=> {
    const newDays = [...formData.days];
    const sets = newDays[dayIndex].exercises[exIndex].sets;
    sets.push({
      setNo: sets.length + 1,
      targetReps: 10,
      targetWeight: 0,
      restSeconds: 60
    });
    setFormData({ ...formData, days: newDays });
  };

  const updateSet = (dayIndex, exIndex, setIndex, field, value)=> {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exIndex].sets[setIndex] = {
      ...newDays[dayIndex].exercises[exIndex].sets[setIndex],
      [field]: value
    };
    setFormData({ ...formData, days: newDays });
  };

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      await axios.post('/api/programs', formData);
      alert('Program created successfully!');
      navigate('/programs');
    } 
    catch (error) {
      console.error('Error creating program:', error);
      alert('Error creating program');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create New Program</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Program Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={ (e)=> setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., 5-Day Upper/Lower Split"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={ (e)=> setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your program..."
            />
          </div>

          <div className="form-group">
            <label>Visibility</label>
            <select
              value={formData.visibility}
              onChange={ (e)=> setFormData({ ...formData, visibility: e.target.value })}>
              <option value="Private"
              >Private (Only you)
              </option>
              <option value="Public">
                Public (Anyone can adopt)
                </option>
            </select>
          </div>

          {/* Days */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3>
                Program Days
                </h3>
              <button className="btn btn-secondary btn-small"
                onClick={addDay}
                type="button">
                ➕ Add Day
              </button>
            </div>

            {formData.days.map((day, dayIndex)=> (
              <div key={dayIndex} className="card bg-[#f8f9fa] mb-4">
                
                <div className="flex justify-between items-center mb-4">
                  <h4>
                    Day{day.dayNumber}
                     </h4>
                  <button className="btn btn-danger btn-small"
                    type="button"
                    onClick={() => removeDay(dayIndex)}>
                    Remove Day
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    Day Title
                    </label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={ (e)=> updateDay(dayIndex, 'title', e.target.value)}
                    placeholder="e.g., Push Day, Leg Day"/>
                </div>

                <div className="form-group">
                  <label>
                    Notes
                    </label>
                  <input
                    type="text"
                    value={day.notes}
                    onChange={ (e)=> updateDay(dayIndex, 'notes', e.target.value)}
                    placeholder="Optional notes for this day"/>
                </div>

                <button className="btn btn-secondary btn-small mb-4 "
                  type="button"
                  onClick={() => addExercise(dayIndex)}>
                  ➕ Add Exercise
                </button>

                {day.exercises?.map((exercise, exIndex)=> (
                  <div key={exIndex} className="bg-white p-4 rounded-[5px] mb-2">
                    <div className="form-group">
                      <label>
                        Exercise
                        </label>

                      <select value={exercise.exercise}
                        onChange={ (e)=> updateExercise(dayIndex, exIndex, 'exercise', e.target.value)}>
                        {exercises.map(ex=> (
                          <option key={ex._id} value={ex._id}>
                            {ex.name} ({ex.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button className="btn btn-secondary btn-small mb-2"
                      type="button"
                      onClick={ ()=> addSet(dayIndex, exIndex)}>
                      ➕ Add Set
                    </button>

                    {exercise.sets?.map((set, setIndex)=> (
                      <div key={setIndex} className="set-row">
                        <span>
                          Set {set.setNo}
                          </span>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={set.targetReps}
                          onChange={(e) => updateSet(dayIndex, exIndex, setIndex, 'targetReps', parseInt(e.target.value))}
                          />

                        <input
                          type="number"
                          placeholder="Weight (Kgs)"
                          value={set.targetWeight}
                          onChange={(e) => updateSet(dayIndex, exIndex, setIndex, 'targetWeight', parseFloat(e.target.value))}
                        />

                        <input
                          type="number"
                          placeholder="Rest (sec)"
                          value={set.restSeconds}
                          onChange={(e) => updateSet(dayIndex, exIndex, setIndex, 'restSeconds', parseInt(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <button className="btn btn-primary"
             type="submit" >
              Create Program
            </button>

            <button className="btn btn-secondary"
              type="button"  
              onClick={ ()=> navigate('/programs')}>
              Cancel
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgram;
