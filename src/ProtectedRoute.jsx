import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "./context/AuthContext";
import { IS_DEV } from "./lib/constants";

const ProtectedRoute = ({ children }) => {
	// In development mode with mock data, allow access without authentication
	if (IS_DEV) {
		return children;
	}

	// In production or when connecting to real backend, use normal authentication flow
	const { isAuthenticated, loading } = useAuthContext();

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;