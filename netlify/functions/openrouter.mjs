import fetch from 'node-fetch';

export async function handler(event) {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Only POST method allowed' })
    };
  }

  const { prompt } = JSON.parse(event.body || '{}');

  if (!prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Prompt is required' })
    };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Missing API key in server environment' })
    };
  }

  try {
    // Try multiple models in order of preference
    const models = [
      "google/gemini-flash-1.5",
      "meta-llama/llama-3.1-8b-instruct:free", 
      "microsoft/phi-3-medium-128k-instruct:free",
      "google/gemma-7b-it:free"
    ];

    let response;
    let lastError;

    for (const model of models) {
      try {
        let requestBody = {
          model: model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
          temperature: 0.7
        };

        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          break; // Success, exit the loop
        } else {
          const errorData = await response.json();
          lastError = `${model}: ${errorData?.error?.message || response.status}`;
          continue; // Try next model
        }
      } catch (err) {
        lastError = `${model}: ${err.message}`;
        continue; // Try next model
      }
    }

    if (!response || !response.ok) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: `All models failed. Last error: ${lastError}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ result: data.choices?.[0]?.message?.content?.trim() || "" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: err.message || "Unexpected server error" })
    };
  }
}
