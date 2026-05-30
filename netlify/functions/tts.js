// Proxy de voz italiana neuronal para produccion (Netlify).
// El navegador no puede pedir el audio de Google directamente (CORS/ORB),
// asi que esta funcion lo descarga del lado servidor y lo devuelve como
// audio/mpeg del mismo origen.
exports.handler = async (event) => {
    const text = (event.queryStringParameters && event.queryStringParameters.q) || "";
    if (!text.trim()) {
        return { statusCode: 400, body: "Missing q" };
    }

    const url =
        "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=it&q=" +
        encodeURIComponent(text.slice(0, 200));

    try {
        const resp = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                Referer: "https://translate.google.com/",
            },
        });

        if (!resp.ok) {
            return { statusCode: 502, body: "TTS upstream error" };
        }

        const buffer = Buffer.from(await resp.arrayBuffer());
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "public, max-age=86400",
            },
            body: buffer.toString("base64"),
            isBase64Encoded: true,
        };
    } catch (err) {
        return { statusCode: 502, body: "TTS fetch failed" };
    }
};
