import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	const isDev = import.meta.env.MODE === "development"; // Vite (o similar) usa esto

	if (isDev) {
		// ⚠️ EN DESARROLLO: permitir acceso sin token
		return children;
	}

	// ✅ EN PRODUCCIÓN: exigir autenticación
	const token = localStorage.getItem("token");
	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
