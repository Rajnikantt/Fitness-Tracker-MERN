import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import CreateProgram from './pages/CreateProgram';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import AdminUsers from './pages/AdminUsers';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false })=> {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">
      Loading...
      </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children })=> {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">
      Loading...
      </div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login"
            element={ 
            <PublicRoute>
                <Login />
              </PublicRoute>
            }
            />

          <Route path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/exercises"
            element={
              <ProtectedRoute>
                <Navbar />
                <Exercises />
              </ProtectedRoute>
            }
          />

          <Route path="/programs"
            element={
              <ProtectedRoute>
                <Navbar />
                <Programs />
              </ProtectedRoute>
            }
          />

          <Route path="/programs/create"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreateProgram />
              </ProtectedRoute>
            }
          />

          <Route path="/programs/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProgramDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/workouts"
            element={
              <ProtectedRoute>
                <Navbar />
                <Workouts />
              </ProtectedRoute>
            }
          />


          <Route path="/workouts/create"
            element={
              <ProtectedRoute>
                <Navbar />
                <CreateWorkout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <Navbar />
                <AdminUsers />
              </ProtectedRoute>
            }
          />

     
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
