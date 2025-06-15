import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuthContext();

	if (loading) {
		// Puedes reemplazar esto por un spinner bonito si quieres
		return <div>Cargando...</div>;
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
