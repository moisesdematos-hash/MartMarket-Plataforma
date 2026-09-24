export const generateTextWithGroq = async (prompt: string, systemContext?: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key não configurada no .env');
  }

  const messages = [];
  if (systemContext) {
    messages.push({ role: 'system', content: systemContext });
  }
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Fast, smart model
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(errorData.error?.message || 'Falha na comunicação com a API de IA');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI text:', error);
    throw error;
  }
};
