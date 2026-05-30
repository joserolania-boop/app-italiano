// Valida el codigo de desbloqueo del curso completo.
// Configura la variable de entorno UNLOCK_CODE en el dashboard de Netlify.
// Puede ser un unico codigo o varios separados por coma (ej. "CODE1,CODE2,CODE3").
exports.handler = async (event) => {
    const code = ((event.queryStringParameters && event.queryStringParameters.code) || "").trim().toUpperCase();

    if (!code) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valid: false, message: "Codigo vacio." }),
        };
    }

    const validCodes = (process.env.UNLOCK_CODE || "")
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);

    if (!validCodes.length) {
        // Si no hay UNLOCK_CODE configurado, rechazar para evitar acceso libre.
        return {
            statusCode: 503,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valid: false, message: "Servicio no configurado." }),
        };
    }

    const isValid = validCodes.includes(code);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            valid: isValid,
            message: isValid ? "Acceso desbloqueado." : "Codigo no valido.",
        }),
    };
};
