function Summary() {
	return (
		<section className="summary">
			<div className="container align-center">
				<h2>Why Choose Us?</h2>
				<p>What Our Customers Like About Our Service</p>
				<div className="grid-benefits">
					<div className="benefit-item">
						<img src="icon1.png" alt="Email Protection" />
						<div>
							<h3>Email Protection</h3>
							<p>
								Prevent spammers and phishing sites from sending emails via your
								domains.
							</p>
						</div>
					</div>

					<div className="benefit-item">
						<img src="icon2.png" alt="Improve Deliverability" />
						<div>
							<h3>Improve Deliverability</h3>
							<p>
								Improve your email deliverability by implementing DMARC
								effectively.
							</p>
						</div>
					</div>

					<div className="benefit-item">
						<img src="icon3.png" alt="Full Visibility" />
						<div>
							<h3>Full Visibility</h3>
							<p>
								Maintain full visibility over email health. Detect and fix
								issues.
							</p>
						</div>
					</div>

					<div className="benefit-item">
						<img src="icon4.png" alt="Reports & Alerts" />
						<div>
							<h3>Reports & Alerts</h3>
							<p>Stay informed. Get periodic reports on DMARC compliance.</p>
						</div>
					</div>

					<div className="benefit-item">
						<img src="icon5.png" alt="Forensic Reports" />
						<div>
							<h3>Forensic Reports</h3>
							<p>Track down emails that cause DMARC compliance failures.</p>
						</div>
					</div>

					<div className="benefit-item">
						<img src="icon6.png" alt="DNS Toolbox" />
						<div>
							<h3>DNS Toolbox</h3>
							<p>
								We provide tools to diagnose DNS issues like SPF/DKIM/DMARC.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
export default Summary;
