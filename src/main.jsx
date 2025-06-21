import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<NotificationProvider>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</NotificationProvider>
		</StrictMode>
	);
} else {
	console.error("Root element not found");
}