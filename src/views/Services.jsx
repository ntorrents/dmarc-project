import ServiceCard from "../components/ServiceCard/ServiceCard";

function Services() {
	return (
		<section id="services" className="services">
			<div className="container">
				<h2>Our Services</h2>
				<div className="service-cards">
					<ServiceCard
						title="Email Protection"
						body="Prevent spammers and phishing sites from sending emails via your domains."
					/>
					<ServiceCard
						title="Improve Deliverability"
						body="Improve your email deliverability by implementing DMARC effectively."
					/>
					<ServiceCard
						title="Full Visibility"
						body="Maintain full visibility over email health. Detect and fix issues within your email program."
					/>
				</div>
			</div>
		</section>
	);
}

export default Services;
