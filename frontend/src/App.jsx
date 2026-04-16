import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, BarChart3, FileText, Camera, ClipboardList, History } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PredictionForm from './components/PredictionForm';
import VisionAnalysis from './pages/VisionAnalysis';
import UnifiedAssessment from './pages/UnifiedAssessment';
import AssessmentHistory from './pages/AssessmentHistory';
import './index.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                SMILE
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/assessment"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  New Assessment
                </Link>
                <Link
                  to="/history"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Link>
                <Link
                  to="/vision"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Vision Only
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-medium text-gray-800">{username}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <UnifiedAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AssessmentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predict"
          element={
            <ProtectedRoute>
              <PredictionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vision"
          element={
            <ProtectedRoute>
              <VisionAnalysis />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/assessment" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
