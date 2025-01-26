import "./App.css";

function App() {
	return (
		<div className="App">
			{/* Header Section */}
			<header className="header">
				<div className="container">
					<h1>Protege tu Dominio con DMARC</h1>
					<p>
						Analizamos y configuramos correctamente DMARC, SPF y DKIM para tu
						empresa.
					</p>
					<a href="#services" className="btn-primary">
						Descubre Nuestros Servicios
					</a>
				</div>
			</header>

			{/* Services Section */}
			<section id="services" className="services">
				<div className="container">
					<h2>Nuestros Servicios</h2>
					<div className="service-cards">
						<div className="card">
							<h3>Análisis de Dominio</h3>
							<p>
								Revisamos la configuración actual de tus registros DMARC, SPF y
								DKIM.
							</p>
						</div>
						<div className="card">
							<h3>Recomendaciones Personalizadas</h3>
							<p>
								Te sugerimos configuraciones óptimas para proteger tu dominio.
							</p>
						</div>
						<div className="card">
							<h3>Configuración Experta</h3>
							<p>Implementamos los ajustes directamente en tu dominio.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Free Analysis Section */}
			<section id="analysis" className="analysis">
				<div className="container">
					<h2>Análisis Gratuito</h2>
					<p>
						Introduce tu dominio y obtén un informe inicial sobre su
						configuración actual.
					</p>
					<form className="analysis-form">
						<input
							type="text"
							placeholder="Ingresa tu dominio (ej: ejemplo.com)"
						/>
						<button type="submit" className="btn-primary">
							Analizar
						</button>
					</form>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="pricing">
				<div className="container">
					<h2>Planes y Precios</h2>
					<div className="pricing-cards">
						<div className="card">
							<h3>Básico</h3>
							<p>Solo análisis inicial y recomendaciones.</p>
							<p>
								<strong>$99</strong>
							</p>
							<button className="btn-secondary">Seleccionar</button>
						</div>
						<div className="card">
							<h3>Estándar</h3>
							<p>Análisis y configuración básica.</p>
							<p>
								<strong>$199</strong>
							</p>
							<button className="btn-secondary">Seleccionar</button>
						</div>
						<div className="card">
							<h3>Premium</h3>
							<p>Configuración avanzada y soporte continuo.</p>
							<p>
								<strong>$299</strong>
							</p>
							<button className="btn-secondary">Seleccionar</button>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="contact">
				<div className="container">
					<h2>Contacto</h2>
					<p>
						¿Tienes preguntas? Contáctanos y estaremos encantados de ayudarte.
					</p>
					<form className="contact-form">
						<input type="text" placeholder="Nombre" />
						<input type="email" placeholder="Correo Electrónico" />
						<textarea placeholder="Tu Mensaje"></textarea>
						<button type="submit" className="btn-primary">
							Enviar
						</button>
					</form>
				</div>
			</section>

			{/* Footer Section */}
			<footer className="footer">
				<div className="container">
					<p>&copy; 2025 ProtegeTuDominio. Todos los derechos reservados.</p>
				</div>
			</footer>
		</div>
	);
}

export default App;
