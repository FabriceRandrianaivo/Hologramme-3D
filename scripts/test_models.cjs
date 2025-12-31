const https = require('https');

const apiKey = process.argv[2] || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is not set.");
    process.exit(1);
}

// 1. Fetch List of Models
const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`🔍 Scanning models with key ending in ...${apiKey.slice(-4)}\n`);

https.get(listUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
        if (res.statusCode !== 200) {
            console.error(`❌ List Error (${res.statusCode}):`, data);
            return;
        }

        const response = JSON.parse(data);
        const models = response.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace('models/', ''));

        console.log(`Found ${models.length} candidate models. Testing access...\n`);

        // 2. Test each model sequentially
        for (const model of models) {
            await testModel(model);
        }
    });
}).on('error', err => console.error("Net Error:", err));

function testModel(modelId) {
    return new Promise((resolve) => {
        const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
        const payload = JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
        });

        const req = https.request(testUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${modelId} - OK (FREE?)`);
                } else if (res.statusCode === 429) {
                    console.log(`⛔ ${modelId} - QUOTA EXCEEDED`);
                } else {
                    const err = JSON.parse(body).error?.message || 'Unknown error';
                    if (err.includes('Quota')) {
                        console.log(`⛔ ${modelId} - QUOTA/PAID ONLY`);
                    } else if (err.includes('not found')) {
                        console.log(`❓ ${modelId} - NOT FOUND (Beta?)`);
                    } else {
                        console.log(`⚠️ ${modelId} - Error ${res.statusCode}: ${err.slice(0, 50)}...`);
                    }
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log(`💀 ${modelId} - NET ERROR`);
            resolve();
        });

        req.write(payload);
        req.end();
    });
}
