import "./Header.css";
import { useState, useEffect } from "react";

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

				<nav className="header__nav">
					<a href="#home" className="header__link">
						Inicio
					</a>
					<a href="#services" className="header__link">
						Servicios
					</a>
					<a href="#contact" className="header__link">
						Contacto
					</a>
				</nav>
			</div>
		</header>
	);
}

export default Header;
