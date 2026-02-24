import  { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProgramDetail = ()=> {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);


const loadProgram = useCallback(async ()=> {
  try {
    const response = await axios.get(`/api/programs/${id}`);
    setProgram(response.data);
  } catch (error) {
    console.error('Error loading program:', error);
    alert('Error loading program');
    navigate('/programs');
  } finally {
    setLoading(false);
  }
}, [id, navigate]);

useEffect(() => {
  loadProgram();
}, [loadProgram]);


  const handleAdopt = async ()=> {
    try {
      await axios.post(`/api/programs/${id}/adopt`);
      alert('Program adopted successfully!');
    }
     catch (error) {
      alert(error.response?.data?.message || 'Error adopting program');
    }
  };

  if (loading) {
    return <div className="loading">
      Loading program...
      </div>;
  }

  if (!program) {
    return <div className="container">
      <div className="card">
        <p>Program not found</p>
        </div>
        </div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2>{program.name}</h2>
            <p className="text-gray-500 mt-2">
              Created by {program.createdBy?.name || 'Unknown'}
            </p>
          </div>
          <span className={program.visibility === 'Public' ? 'badge badge-public' : 'badge badge-private'}>
            {program.visibility}
          </span>
        </div>

        {program.description && (
          <p className="text-gray-500 mb-6">
            {program.description}
          </p>
        )}

        {program.visibility === 'Public' && (
          <button className="btn btn-success mb-6"
            onClick={handleAdopt}>
            Adopt This Program
          </button>
        )}

        <button
          className="btn btn-secondary mb-6 ml-2"
          onClick={ ()=> navigate('/programs')}>
          ← Back to Programs
        </button>
      </div>

      {/* Program Days */}
      {program.days?.map((day, dayIndex)=> (
        <div key={dayIndex} className="card">
          <h3>
            Day {day.dayNumber}: {day.title}
            </h3>
          {day.notes && <p className="text-gray-500 mt-2">
            {day.notes}</p>
            }

          <div className="mt-6">
            {day.exercises?.map((exercise, exIndex)=> (
              <div key={exIndex} className="bg-gray-100 p-4 rounded-lg mb-4">
                <h4 className="mb-2">
                  {exIndex + 1}. {exercise.exercise?.name || 'Unknown Exercise'}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {exercise.exercise?.category} | {exercise.exercise?.equipment}
                </p>
                {exercise.trainingStyle && (
                  <p className="text-xs text-blue-600 mb-2">
                    Style: {exercise.trainingStyle}
                  </p>
                )}
                {exercise.notes && (
                  <p className="text-xs text-gray-500 italic mb-2">
                    Note: {exercise.notes}
                  </p>
                )}

                {/* Sets Table */}
                <table className="table mt-3" >
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Reps</th>
                      <th>Weight</th>
                      <th>Rest</th>
                      {exercise.sets?.some(s => s.intensityPercent) && <th>Intensity</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {exercise.sets?.map((set, setIndex)=> (
                      <tr key={setIndex}>
                        <td>{set.setNo}</td>
                        <td>{set.targetReps} reps</td>
                        <td>{set.targetWeight > 0 ? `${set.targetWeight} kgs` : 'Bodyweight'}</td>
                        <td>{set.restSeconds}s</td>
                        {set.intensityPercent && <td>{set.intensityPercent}%</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {(!day.exercises || day.exercises.length === 0) && (
              <p className="text-gray-500 text-center p-4">
                No exercises planned for this day
              </p>
            )}
          </div>
        </div>
      ))}

      {(!program.days || program.days.length === 0) && (
        <div className="card">
          <p className="text-gray-500 text-center">
            No days planned in this program yet
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramDetail;
