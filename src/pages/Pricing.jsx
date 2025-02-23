import { useState, useEffect } from "react";
import "./Pricing.css";
import pricingData from "../data/pricingData.json";
import { Link } from "react-router-dom";

const Pricing = () => {
	const [plans, setPlans] = useState({});

	useEffect(() => {
		setPlans(pricingData);
	}, []);

	const features = Object.keys(plans.Basic || {});

	return (
		<div className="pricing-page">
			{/* Sección de imagen de fondo */}
			<div className="pricing-hero">
				<h1>Pricing Plans</h1>
				<p>Compare features and choose the best plan for you.</p>
			</div>

			<div className="pricing-table">
				<table>
					<thead>
						<tr>
							<th>Features</th>
							<th>Basic</th>
							<th>Standard</th>
							<th>Premium</th>
						</tr>
					</thead>
					<tbody>
						{features.map((feature, index) => (
							<tr key={index}>
								<td>{feature}</td>
								<td>{plans.Basic?.[feature] || "-"}</td>
								<td>{plans.Standard?.[feature] || "-"}</td>
								<td>{plans.Premium?.[feature] || "-"}</td>
							</tr>
						))}
						<tr>
							<td></td>
							<td>
								<Link to="/checkout?plan=Basic">
									<button className="select-btn">Select</button>
								</Link>
							</td>
							<td>
								<Link to="/checkout?plan=Standard">
									<button className="select-btn">Select</button>
								</Link>
							</td>
							<td>
								<Link to="/checkout?plan=Premium">
									<button className="select-btn">Select</button>
								</Link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Pricing;
