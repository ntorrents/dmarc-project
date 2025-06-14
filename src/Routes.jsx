import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Header from "./components/layout/Header";
import DashboardHeader from "./components/layout/DashboardHeader";
import Footer from "./components/layout/Footer";
import DashboardFooter from "./components/layout/DashboardFooter";
import ScrollToTop from "./utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useLocation } from "react-router-dom";

const AppLayout = ({ children }) => {
	const location = useLocation();
	const isDashboard = location.pathname.startsWith('/dashboard');

	return (
		<div className="min-h-screen flex flex-col">
			{isDashboard ? <DashboardHeader /> : <Header />}
			<main className="flex-grow">
				{children}
			</main>
			{isDashboard ? <DashboardFooter /> : <Footer />}
		</div>
	);
};

const AppRoutes = () => {
	return (
		<Router>
			<ScrollToTop />
			<AppLayout>
				<AnimatePresence mode="wait">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/pricing" element={<Pricing />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/checkout" element={<Checkout />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route path="/terms" element={<Terms />} />
						<Route path="/privacy" element={<Privacy />} />
					</Routes>
				</AnimatePresence>
			</AppLayout>
		</Router>
	);
};

export default AppRoutes;