import React, { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Exercises = ()=> {
  const { isAdmin } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Chest',
    equipment: 'Barbell',
    description: ''
  });

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];
  const equipmentTypes = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cable', 'Kettlebell', 'Resistance Band', 'Other'];


 const loadExercises = useCallback(async ()=> {
  try {
    let url = '/api/exercises?';
    if (search) url += `search=${search}&`;
    if (categoryFilter) url += `category=${categoryFilter}`;

    const response = await axios.get(url);
    setExercises(response.data);
  } catch (error) {
    console.error('Error loading exercises:', error);
  } finally {
    setLoading(false);
  }
}, [search, categoryFilter]);

useEffect( ()=> {
  loadExercises();
}, [loadExercises]);


  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      await axios.post('/api/exercises', formData);
      setFormData({ name: '', category: 'Chest', equipment: 'Barbell', description: '' });
      setShowForm(false);
      loadExercises();
    } 
    catch (error) {
      console.error('Error creating exercise:', error);
      alert('Error creating exercise');
    }
  };

  const handleDelete = async (id)=> {
    if (window.confirm('Are you sure you want to deactivate this exercise?')) {
      try {
        await axios.delete(`/api/exercises/${id}`);
        loadExercises();
      } 
      catch (error) {
        console.error('Error deleting exercise:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">
      Loading exercises...
      </div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2>
            Exercise Library
            </h2>
          {isAdmin && (
            <button className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}> 
              {showForm ? '✕ Cancel' : '➕ Add Exercise'}
            </button>)
            }
        </div>

        {/* Filters */}
        <div className="grid grid-cols-[2fr_1fr] gap-4 mb-6">
          <div className="form-group mb-0">
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={ (e)=> setSearch(e.target.value)}/>
          </div>

          <div className="form-group mb-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              >
              <option value="">
                All Categories
                </option>
              {categories.map(cat => (
                <option key={cat}
                value={cat}>{cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Exercise Form */}
        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="card bg-[#f8f9fa] p-6" >
            <h3>
              Add New Exercise
              </h3>
            <div className="form-group">
              <label>Name</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              
              <div className="form-group">
                <label>Equipment</label>
                <select
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                >
                  {equipmentTypes.map(eq => (
                    <option key={eq} value={eq}>{eq}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={ (e)=> setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Exercise
              </button>
          </form>
        )}

        {/* Exercises List */}
        <div className="grid grid-3">
          {exercises.map(exercise => (
            <div key={exercise._id} className="card bg-[#f8f9fa]">
              <h3>
                {exercise.name}
                </h3>
              <div className="mt-2 text-sm text-gray-600">
                <div className="mb-1">
                  <strong>Category:</strong> 
                  {exercise.category}
                </div>

                <div className="mb-1">
                  <strong>Equipment:</strong>
                  {exercise.equipment}
                </div>

                {exercise.description && (
                  <div className="mt-2 text-xs">
                    {exercise.description}
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <button className="btn btn-danger btn-small mt-3 w-full"
                  onClick={ ()=> handleDelete(exercise._id)}>
                  Deactivate
                </button>
              )}
            </div>
          ))}
        </div>

        {exercises.length === 0 && (
          <p className="text-center text-gray-600 p-8">
            No exercises found. 
            {isAdmin && 'Add some exercises to get started!'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Exercises;
