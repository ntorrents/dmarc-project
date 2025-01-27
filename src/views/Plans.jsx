import PriceCard from "../components/PriceCard/PriceCard";
function Plans() {
    return (
        <section id="pricing" className="pricing">
            <div className="container">
                <h2>Planes y Precios</h2>
                <div className="pricing-cards">
                    <PriceCard
                        title="Básico"
                        body="Solo análisis inicial y recomendaciones."
                        price="$99"
                    />
                    <PriceCard
                        title="Estándar"
                        body="Análisis y configuración básica."
                        price="$199"
                    />
                    <PriceCard
                        title="Premium"
                        body="Configuración avanzada y soporte continuo."
                        price="$299"
                    />
                </div>
            </div>
        </section>
    );
}

export default Plans;
