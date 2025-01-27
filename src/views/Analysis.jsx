function Analysis() {
    return (
        <section id="analysis" className="analysis">
            <div className="container">
                <h2>Análisis Gratuito</h2>
                <p className="align-center">
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
    );
}

export default Analysis;
