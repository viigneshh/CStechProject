import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import RegisterPage from './Pages/register';
import LoginPage from './Pages/login';
import ProtectedRoute from './components/protectedRoutes';
//import './App.css';

function App() {
  return (
    <Routes>
      {/* Default route → redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected route for dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
