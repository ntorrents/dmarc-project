import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/App";
import Pricing from "./pages/Pricing2";
import Contact from "./pages/Contact";
import Header from "./views/Header/Header";
import Footer from "./views/Footer";
import ScrollToTop from "./functions/scrollToTop";
import Checkout from "./pages/Checkout";

const AppRoutes = () => {
	return (
		<Router>
			<ScrollToTop />
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/checkout" element={<Checkout />} />
			</Routes>
			<Footer />
		</Router>
	);
};

export default AppRoutes;
