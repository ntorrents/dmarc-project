import "./Pricing2.css";

const Pricing2 = () => {
	return (
		<div className="pricing-container">
			<div className="pricing-hero">
				<h1>Pricing Plans</h1>
				<p>Compare features and choose the best plan for you.</p>
			</div>
			<h2 className="pricing-title">Powerful. Agile. Intuitive.</h2>
			<p className="pricing-subtitle">
				Select the plan that fits your needs, whether you are only looking to
				launch simple surveys or need the tools to change the world.
			</p>
			<div className="pricing-plans">
				<div className="plan">
					<h3>Collaborator</h3>
					<p className="price">
						$49<span>/month</span>
					</p>
					<p className="price-yearly">or $300 per year</p>
					<button className="buy-btn">BUY NOW</button>
					<button className="trial-btn">Start free trial</button>
					<ul>
						<li>✔ Unlimited surveys</li>
						<li>✔ Unlimited questions</li>
						<li>✔ No response charges</li>
						<li>✔ 25 essential question types</li>
						<li>✔ Data exports (CSV, PDF, PPT, XLS)</li>
						<li>✔ Email support</li>
					</ul>
				</div>

				<div className="plan popular">
					<h3>Professional</h3>
					<p className="price">
						$149<span>/month</span>
					</p>
					<p className="price-yearly">or $1020 per year</p>
					<button className="buy-btn">BUY NOW</button>
					<button className="trial-btn">Start free trial</button>
					<ul>
						<li>✔ Everything in Collaborator, plus:</li>
						<li>✔ Advanced question types</li>
						<li>✔ Advanced reports (profile, longitudinal)</li>
						<li>✔ Segment and filter reports</li>
						<li>✔ Advanced logic and piping</li>
						<li>✔ A/B split testing</li>
						<li>✔ Email and phone support</li>
						<li>✔ Disqualifications</li>
						<li>✔ API access</li>
					</ul>
				</div>

				<div className="plan">
					<h3>Full Access</h3>
					<p className="price">
						$249<span>/month</span>
					</p>
					<p className="price-yearly">or $1800 per year</p>
					<button className="buy-btn">BUY NOW</button>
					<button className="trial-btn">Start free trial</button>
					<ul>
						<li>✔ Everything in Professional, plus:</li>
						<li>✔ Max diff</li>
						<li>✔ Conjoint analysis</li>
						<li>✔ Crosstab reports</li>
						<li>✔ TURF reports</li>
						<li>✔ Open-text analysis</li>
						<li>✔ SPSS export</li>
						<li>✔ R scripts</li>
						<li>✔ Audio and video sentiment</li>
						<li>✔ Image heatmap</li>
						<li>✔ Data-cleaning tool</li>
						<li>✔ Custom scripting</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Pricing2;
