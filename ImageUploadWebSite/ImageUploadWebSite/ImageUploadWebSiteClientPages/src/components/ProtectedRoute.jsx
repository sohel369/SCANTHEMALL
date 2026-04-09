import { Navigate } from 'react-router-dom';
import { authAPI } from '../api/api';

const ProtectedRoute = ({ children }) => {
  const user = authAPI.getCurrentUser();
  
  if (!user) {
    // Redirect to home page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
