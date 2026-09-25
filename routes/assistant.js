// routes/assistant.js
// Proxies product questions to Groq so the API key stays on the server.
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

router.post('/', async (req, res) => {
  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) {
    return res.status(400).json({ message: 'Please enter a query.' });
  }
  if (query.length > 1000) {
    return res.status(400).json({ message: 'Query is too long.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({
      available: false,
      message: 'The assistant is unavailable in this demo. Browse the catalogue below or place a sample order instead.',
    });
  }

  try {
    const products = await Product.find({ isActive: true }).select('name').limit(50).lean();
    const productList = products.map((p) => p.name).join(', ');

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a sales agent for a chemical wholesaler company - Ceekay Enterprise. The company sells the following products - ${productList}. Give responses to the client queries accordingly.`,
          },
          { role: 'user', content: query },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status);
      return res.status(502).json({ available: false, message: 'The assistant could not answer right now. Please try again later.' });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || '';
    res.json({ available: true, answer });
  } catch (error) {
    console.error('Assistant error:', error.message);
    res.status(502).json({ available: false, message: 'The assistant could not answer right now. Please try again later.' });
  }
});

module.exports = router;
