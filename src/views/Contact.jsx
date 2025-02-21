function Contact() {
	return (
		<section id="contact" className="contact">
			<div className="container">
				<h2>Contact Us</h2>
				<p className="align-center">
					Do you have questions? Contact us, and we’ll be happy to help.
				</p>
				<form className="contact-form">
					<input type="text" placeholder="Name" />
					<input type="email" placeholder="Email" />
					<textarea placeholder="Message"></textarea>
					<button type="submit" className="btn-primary">
						Submit
					</button>
				</form>
			</div>
		</section>
	);
}

export default Contact;
