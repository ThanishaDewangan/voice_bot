const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const exchangeService = require('./exchangeService');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/api/symbols', async (req, res) => {
  try {
    const { exchange } = req.body;
    const symbols = await exchangeService.getSymbols(exchange);
    res.json({ success: true, exchange, symbols, count: symbols.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/price', async (req, res) => {
  try {
    const { exchange, symbol } = req.body;
    const price = await exchangeService.getPrice(exchange, symbol);
    res.json({ success: true, exchange, symbol, price });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/get-token', async (req, res) => {
  const response = await axios.post(
    `https://api.bland.ai/v1/agents/f2882801-15e1-4c48-981a-265b13e7e79f/authorize`,
    {},
    {
      headers: {
        Authorization: `Bearer ${process.env.BLAND_API_KEY}`
      }
    }
  );
  res.json({ token: response.data.token });
});

app.listen(PORT, () => console.log(`\uD83D\uDE80 Trading bot server running on port ${PORT}`));