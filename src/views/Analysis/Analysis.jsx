import { checkDMARC } from "../../functions/check_dmarc";
import { useState } from "react";
import "./Analysis.css";

function Analysis() {
    const [domain, setDomain] = useState("");
    const [result, setResult] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResult(null); // Limpiar resultados anteriores

        if (!domain) {
            setResult({
                status: "error",
                message: "Por favor, ingresa un dominio válido.",
            });
            return;
        }

        const analysisResult = await checkDMARC(domain);
        setResult(analysisResult);
    };

    const closeResult = () => {
        setResult(null);
    };

    return (
        <section id="analysis" className="analysis">
            <div className="container">
                <h2>Análisis Gratuito</h2>
                <p className="align-center">
                    Introduce tu dominio y obtén un informe inicial sobre su
                    configuración actual.
                </p>
                <form className="analysis-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ingresa tu dominio (ej: ejemplo.com)"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">
                        Analizar
                    </button>
                </form>
                {result && (
                    <div
                        className={`analysis-result ${result.status} ${
                            result ? "visible" : ""
                        }`}
                    >
                        <button className="close-btn" onClick={closeResult}>
                            &times;
                        </button>
                        <p>{result.message}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Analysis;
