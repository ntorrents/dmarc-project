import "./Contact.css";

const Contact = () => {
	return (
		<div className="contactPage-page">
			<div className="contactPage-header">
				<h1>Contact Us</h1>
				<p>We’re here to help. Get in touch with us today.</p>
			</div>

			<div className="contactPage-container">
				<div className="contactPage-info">
					<h2>Our Office</h2>
					<p>123 Secure St, Cyber City, USA</p>
					<p>Email: support@safedmarc.com</p>
					<p>Phone: +1 (555) 123-4567</p>
				</div>

				<div className="contactPage-form">
					<h2>Send a Message</h2>
					<form>
						<input type="text" placeholder="Your Name" required />
						<input type="email" placeholder="Your Email" required />
						<textarea placeholder="Your Message" required></textarea>
						<button type="submit">Send Message</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Contact;
