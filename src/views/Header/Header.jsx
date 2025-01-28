import "./Header.css";
import { useState, useEffect } from "react";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
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
            <div className="header__container">
                <div className="header__text">
                    <h1
                        className={`header__title ${
                            isScrolled ? "header__title--scrolled" : ""
                        }`}
                    >
                        Protege tu Dominio con DMARC
                    </h1>
                    <p className="header__subtitle">
                        Analizamos y configuramos DMARC, SPF y DKIM para tu
                        empresa.
                    </p>
                </div>

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
