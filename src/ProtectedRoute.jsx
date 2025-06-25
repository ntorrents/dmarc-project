import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthContext } from './context/AuthContext';
import { ROUTES } from './lib/constants';

const ProtectedRoute = ({ children, requiredPermission = null, adminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin, isSuperAdmin, hasPermission } = useAuthContext();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check admin-only routes
  if (adminOnly && !isAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check specific permission requirements
  if (requiredPermission && !hasPermission(requiredPermission) && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h2>
          <p className="text-gray-600 mb-4">
            You need the "{requiredPermission}" permission to access this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;