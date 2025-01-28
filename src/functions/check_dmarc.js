export async function checkDMARC(domain) {
    const apiUrl = `https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("No se pudo conectar al servicio de DNS.");
        }

        const data = await response.json();

        // Verificar si hay registros TXT válidos
        if (data.Answer) {
            const dmarcRecord = data.Answer.find((record) =>
                record.data.startsWith("v=DMARC1")
            );

            if (dmarcRecord) {
                return {
                    status: "success",
                    message: `DMARC válido encontrado: ${dmarcRecord.data}`,
                };
            } else {
                return {
                    status: "error",
                    message: "No se encontró un registro DMARC válido.",
                };
            }
        } else {
            return {
                status: "error",
                message: "No se encontraron registros para el dominio.",
            };
        }
    } catch (error) {
        return {
            status: "error",
            message: `Error al consultar el registro DMARC: ${error.message}`,
        };
    }
}
