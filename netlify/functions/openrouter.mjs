import fetch from 'node-fetch';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST method allowed' })
    };
  }

  const { prompt } = JSON.parse(event.body || '{}');

  if (!prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Prompt is required' })
    };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing API key in server environment' })
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/horizon-beta",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data?.error?.message || 'OpenRouter API error' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.choices?.[0]?.message?.content?.trim() || "" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unexpected server error" })
    };
  }
}
