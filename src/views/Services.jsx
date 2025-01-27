import ServiceCard from "../components/ServiceCard/ServiceCard";

function Services() {
    return (
        <section id="services" className="services">
            <div className="container">
                <h2>Nuestros Servicios</h2>
                <div className="service-cards">
                    <ServiceCard
                        title="Análisis de Dominio"
                        body="Revisamos la configuración actual de tus registros DMARC, SPF y DKIM."
                    />
                    <ServiceCard
                        title="Recomendaciones Personalizadas"
                        body="Te sugerimos configuraciones óptimas para proteger tu dominio."
                    />
                    <ServiceCard
                        title="Configuración Experta"
                        body="Implementamos los ajustes directamente en tu dominio."
                    />
                </div>
            </div>
        </section>
    );
}

export default Services;
