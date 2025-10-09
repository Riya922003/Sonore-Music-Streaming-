require('dotenv').config();
const fetch = global.fetch || require('node-fetch');

async function listAvailableModels() {
  try {
    // Check if the API key is loaded
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in .env file.');
      return;
    }

    console.log('✅ Using GEMINI_API_KEY. Fetching models from Generative Language API...\n');

    // Use the public REST endpoint to list models. Provide the API key as a query param.
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Generative Language API returned ${resp.status}: ${text}`);
    }

    const data = await resp.json();

    if (!data || !Array.isArray(data.models)) {
      console.log('No models field returned from API. Full response:');
      console.dir(data, { depth: null });
      return;
    }

    console.log('--- Available Gemini Models ---');
    for (const m of data.models) {
      // Some model entries may not include supportedGenerationMethods; guard against that
      const methods = Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods : [];
      if (methods.includes('generateText') || methods.includes('generateContent') || methods.length > 0) {
        console.log(`\nModel Name: ${m.name}`);
        if (m.displayName) console.log(`  - Display Name: ${m.displayName}`);
        if (methods.length) console.log(`  - Supported Methods: [${methods.join(', ')}]`);
        if (m.description) console.log(`  - Description: ${m.description}`);
      }
    }
    console.log('\n---------------------------------');

  } catch (error) {
    console.error('❌ An error occurred while fetching the models:', error);
  }
}

listAvailableModels();

