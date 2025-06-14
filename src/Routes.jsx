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
import Footer from "./components/layout/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
	return (
		<Router>
			<ScrollToTop />
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-grow">
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
				</main>
				<Footer />
			</div>
		</Router>
	);
};

export default AppRoutes;
