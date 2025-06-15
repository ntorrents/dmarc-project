import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
		</StrictMode>
	);
} else {
	console.error("Root element not found");
}
