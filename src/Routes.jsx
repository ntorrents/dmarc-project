import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// Import pages
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyDomains from "./pages/MyDomains";
import DomainDetail from "./pages/DomainDetail";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import Reports from "./pages/Reports";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Import layout components
import Header from "./components/layout/Header";
import DashboardHeader from "./components/layout/DashboardHeader";
import Footer from "./components/layout/Footer";
import DashboardFooter from "./components/layout/DashboardFooter";

// Import utilities and guards
import ScrollToTop from "./utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./lib/constants";

const AppLayout = ({ children }) => {
	const location = useLocation();
	const isDashboard = location.pathname.startsWith("/dashboard");

	return (
		<div className="min-h-screen flex flex-col">
			{isDashboard ? <DashboardHeader /> : <Header />}
			<main className="flex-grow">{children}</main>
			{isDashboard ? <DashboardFooter /> : <Footer />}
		</div>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

const AppRoutes = () => {
	return (
		<Router>
			<ScrollToTop />
			<AppLayout>
				<AnimatePresence mode="wait">
					<Routes>
						{/* Public Routes */}
						<Route path={ROUTES.HOME} element={<Home />} />
						<Route path={ROUTES.PRICING} element={<Pricing />} />
						<Route path={ROUTES.CONTACT} element={<Contact />} />
						<Route path="/checkout" element={<Checkout />} />
						<Route path={ROUTES.LOGIN} element={<Login />} />
						<Route path={ROUTES.REGISTER} element={<Signup />} />
						<Route path={ROUTES.TERMS} element={<Terms />} />
						<Route path={ROUTES.PRIVACY} element={<Privacy />} />

						{/* Protected Dashboard Routes */}
						<Route
							path={ROUTES.DASHBOARD}
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path={ROUTES.DOMAINS}
							element={
								<ProtectedRoute requiredPermission="view_domains">
									<MyDomains />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/dashboard/domains/:id"
							element={
								<ProtectedRoute requiredPermission="view_domains">
									<DomainDetail />
								</ProtectedRoute>
							}
						/>

						<Route
							path={ROUTES.REPORTS}
							element={
								<ProtectedRoute requiredPermission="view_reports">
									<Reports />
								</ProtectedRoute>
							}
						/>

						<Route
							path={ROUTES.THREATS}
							element={
								<ProtectedRoute requiredPermission="view_threats">
									<ThreatIntelligence />
								</ProtectedRoute>
							}
						/>

						<Route
							path={ROUTES.SETTINGS}
							element={
								<ProtectedRoute adminOnly>
									<Settings />
								</ProtectedRoute>
							}
						/>

						<Route
							path={ROUTES.PROFILE}
							element={
								<ProtectedRoute>
									<UserProfile />
								</ProtectedRoute>
							}
						/>

						{/* Admin Only Routes */}
						<Route
							path={ROUTES.USERS}
							element={
								<ProtectedRoute adminOnly requiredPermission="manage_users">
									<Settings />
								</ProtectedRoute>
							}
						/>

						<Route
							path={ROUTES.AUDIT_LOGS}
							element={
								<ProtectedRoute adminOnly requiredPermission="view_audit_logs">
									<Reports />
								</ProtectedRoute>
							}
						/>

						{/* 404 Route */}
						<Route
							path="*"
							element={
								<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
									<div className="text-center">
										<h1 className="text-6xl font-bold text-gray-400 mb-4">
											404
										</h1>
										<h2 className="text-2xl font-bold text-gray-900 mb-2">
											Page Not Found
										</h2>
										<p className="text-gray-600 mb-4">
											The page you&apos;re looking for doesn&apos;t exist.
										</p>
										<a href={ROUTES.HOME} className="btn-primary">
											Go Home
										</a>
									</div>
								</div>
							}
						/>
					</Routes>
				</AnimatePresence>
			</AppLayout>
		</Router>
	);
};

export default AppRoutes;
