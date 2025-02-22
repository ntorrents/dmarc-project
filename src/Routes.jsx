import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/App";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Header from "./views/Header/Header";
import Footer from "./views/Footer";

const AppRoutes = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/contact" element={<Contact />} />
			</Routes>
			<Footer />
		</Router>
	);
};

export default AppRoutes;
