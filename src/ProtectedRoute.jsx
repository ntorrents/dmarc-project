import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	// Aquí comprobamos si el usuario está "logueado"
	// Por ejemplo, si tienes un token guardado en localStorage
	const token = localStorage.getItem("token");

	if (!token) {
		// Si no hay token, redirige a login
		return <Navigate to="/login" replace />;
	}

	// Si hay token, renderiza el componente hijo (dashboard)
	return children;
};

export default ProtectedRoute;
