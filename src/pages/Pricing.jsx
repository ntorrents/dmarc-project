import "./Pricing.css";

const Pricing = () => {
	return (
		<div className="pricing-page">
			<div className="pricing-header">
				<h1>Our Pricing Plans</h1>
				<p>Choose the best plan that suits your needs.</p>
			</div>

			<div className="pricing-container">
				<div className="pricing-card">
					<h2>Basic</h2>
					<p>Essential email protection and monitoring.</p>
					<span>$9.99/month</span>
				</div>

				<div className="pricing-card">
					<h2>Standard</h2>
					<p>Advanced security features with reports.</p>
					<span>$19.99/month</span>
				</div>

				<div className="pricing-card">
					<h2>Premium</h2>
					<p>Full DMARC compliance and expert support.</p>
					<span>$29.99/month</span>
				</div>
			</div>
		</div>
	);
};

export default Pricing;
