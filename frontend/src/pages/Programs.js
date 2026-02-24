import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Programs = ()=> {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, my, public

  useEffect( ()=> {
    loadPrograms();
  },);

  const loadPrograms = async ()=> {
    try {
      let url = '/api/programs';
      if (filter === 'my') url = '/api/programs/my';
      if (filter === 'public') url = '/api/programs/public';
      
      const response = await axios.get(url);
      setPrograms(response.data);
    } 
    catch (error) {
      console.error('Error loading programs:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (programId)=> {
    try {
      await axios.post(`/api/programs/${programId}/adopt`);
      alert('Program adopted successfully!');
    } 
    catch (error) {
      alert(error.response?.data?.message || 'Error adopting program');
    }
  };

  const handleDelete = async (programId)=> {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await axios.delete(`/api/programs/${programId}`);
        loadPrograms();
      }
       catch (error) {
        alert('Error deleting program');
      }
    }
  };

  if (loading) {
    return <div className="loading">
      Loading programs...
      </div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-center mb-6" >
          <h2>Workout Programs</h2>
          <Link to="/programs/create" className="btn btn-primary">
            ➕ Create Program
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={ ()=> setFilter('all')}>
            All Programs
          </button>

          <button
            className={`btn ${filter === 'my' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={ ()=> setFilter('my')}>
            My Programs
          </button>

          <button
            className={`btn ${filter === 'public' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={ ()=> setFilter('public')}>
            Public Programs
          </button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-2">
          {programs.map(program => (
            <div key={program._id} className="card bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3>{program.name}</h3>
                <span className={program.visibility === 'Public' ? 'badge badge-public' : 'badge badge-private'}>
                  {program.visibility}
                </span>
              </div>
              
              {program.description && (
                <p className="text-gray-500 mb-4 text-sm">
                  {program.description}
                </p>
              )}
              
              <div className="text-xs text-gray-600 mb-2">
                <div>
                  Created by: {program.createdBy?.name || 'Unknown'}
                  </div>
                <div>{program.days?.length || 0} days planned</div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link to={`/programs/${program._id}`} 
                  className="btn btn-primary btn-small">
                  View Details
                </Link>
                
                {program.visibility === 'Public' && (
                  <button className="btn btn-success btn-small"
                    onClick={ ()=> handleAdopt(program._id)}>
                    Adopt Program
                  </button>
                )}
                
                {filter === 'my' && (
                  <button className="btn btn-danger btn-small"
                    onClick={ ()=> handleDelete(program._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <p className="text-center text-gray-600 p-8">
            No programs found. Create your first program!
          </p>
        )}
      </div>
    </div>
  );
};

export default Programs;
