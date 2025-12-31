const https = require('https');

const apiKey = process.env.VITE_GEMINI_API_KEY || process.argv[2];

if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is not set.");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Error: Status Code ${res.statusCode}`);
            console.error(data);
            return;
        }

        const models = JSON.parse(data);
        console.log("Available Models:");
        models.models.forEach(model => {
            // Afficher tous les modèles disponibles pour le debug
            console.log(`- ${model.name}`);
        });
    });

}).on('error', (err) => {
    console.error("Error: ", err.message);
});
