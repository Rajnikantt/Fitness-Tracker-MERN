import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = ()=> {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( ()=> {
    loadUsers();
  }, []);

  const loadUsers = async ()=> {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } 
    catch (error) {
      console.error('Error loading users:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus)=> {
    try {
      await axios.put(`/api/users/${userId}`, {
        isActive: !currentStatus
      });
      loadUsers();
    } 
    catch (error) {
      alert('Error updating user status');
    }
  };

  const handleToggleRole = async (userId, currentRole)=> {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    if (window.confirm(`Change role to ${newRole}?`)) {
      try {
        await axios.put(`/api/users/${userId}`, {
          role: newRole
        });
        loadUsers();
      } 
      catch (error) {
        alert('Error updating user role');
      }
    }
  };

  if (loading) {
    return <div className="loading">
      Loading users...
      </div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-gray-800 mb-4">
          User Management
          </h2>
        <p className="text-gray-600 mb-6">
          Manage all users in the system
        </p>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={user.role === 'Admin' ? 'badge badge-admin' : 'badge badge-user'}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className="inline-block w-[10px] h-[10px] rounded-full"
                      style={{
                        backgroundColor: user.isActive ? '#27ae60' : '#e74c3c',
                        marginRight: '0.5rem'}}>
                      </span>

                  {user.isActive ? 'Active' : 'Inactive'}
                </td>

                <td>
                  {new Date(user.createdDate).toLocaleDateString()}
                  </td>

                <td>
                  <div className="flex gap-2">
                    <button className={`btn btn-small ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                    onClick={ ()=> handleToggleActive(user._id, user.isActive)}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button className="btn btn-secondary btn-small"
                       onClick={ ()=> handleToggleRole(user._id, user.role)}>
                      Make
                      {user.role === 'Admin' ? 'User' : 'Admin'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-600 p-8">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
