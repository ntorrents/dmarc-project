import { useLocation } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const selectedPlan = params.get("plan");

	return (
		<div className="checkout-page">
			{/* Imagen de fondo */}
			<div className="checkout-hero">
				<img src="bg-pc.jpg" alt="Checkout Background" />
			</div>

			{/* Contenido */}
			<div className="checkout-container">
				<h1>Checkout</h1>
				<p>
					You selected the <strong>{selectedPlan}</strong> plan.
				</p>
				<p>This page is under construction. Please check back later.</p>
			</div>
		</div>
	);
};

export default Checkout;
