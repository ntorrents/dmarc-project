import PriceCard from "../components/PriceCard/PriceCard";
function Plans() {
	return (
		<section id="pricing" className="pricing">
			<div className="container">
				<h2>Plans & Pricing</h2>
				<div className="pricing-cards">
					<PriceCard
						title="Basic"
						body="Initial DMARC analysis with recommendations to improve email security."
						price="$99"
					/>
					<PriceCard
						title="Standard"
						body="DMARC analysis, basic configuration, and SPF/DKIM alignment verification."
						price="$199"
					/>
					<PriceCard
						title="Premium"
						body="Advanced DMARC setup, continuous monitoring, and dedicated support."
						price="$299"
					/>
				</div>
			</div>
		</section>
	);
}

export default Plans;
