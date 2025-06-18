// createAgent.js
const axios = require('axios');
require('dotenv').config();

const BLAND_API_KEY = process.env.BLAND_API_KEY;

const createAgent = async () => {
  const config = {
    prompt: `You are an expert OTC trading assistant. Follow this flow:
1. Ask user for exchange: Binance, Bybit, OKX, or Deribit.
2. Use FetchExchangeSymbols tool to list symbols.
3. Ask user to pick symbol.
4. Use FetchSymbolPrice to get the price.
5. Ask quantity and price they want to trade.
6. Confirm back the full order.`,
    voice: "maya",
    language: "ENG",
    model: "base",
    first_sentence: "Hello! I'm your OTC assistant. Which exchange would you like to trade on today?",
    max_duration: 10,
    interruption_threshold: 100,
    tools: [
      "TL-ae2fb515-7df3-49f2-bd8d-3cc655597163", "TL-365762dc-1b4f-4359-a34e-6d7cb7039c51"
    ],
    analysis_schema: {
      exchange_selected: "string",
      symbol_selected: "string",
      current_price: "number",
      desired_quantity: "string",
      desired_price: "string",
      order_confirmed: "boolean"
    }
  };

  const res = await axios.post("https://api.bland.ai/v1/agents", config, {
    headers: { Authorization: `Bearer ${BLAND_API_KEY}` }
  });

  console.log("Agent created:", res.data.agent.agent_id);
};

createAgent();
