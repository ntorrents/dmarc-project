import "./Header.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
			<div className="clearfix"></div>
			<div className="header__container">
				<h1 className="header__title">SAFEDMARC</h1>

				<ul className="nav-bar">
					<li className="nav-item">
						<Link to="/" className="nav-link">
							Home
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/pricing" className="nav-link">
							Pricing
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/contact" className="nav-link">
							Contact
						</Link>
					</li>
					<li className="nav-item">
						<a href="#login" className="nav-link">
							Log In
						</a>
					</li>
					<li>
						<a href="register" className="gn-button">
							Free Trial
						</a>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default Header;
