require('dotenv').config();
const axios = require('axios');

async function createAgent() {
  const symbolToolId = process.env.SYMBOL_TOOL_ID;
  const priceToolId = process.env.PRICE_TOOL_ID;

  const agentConfig = {
    prompt: `You are an OTC trading assistant. Guide the user:
1. Ask which exchange they want (OKX, Bybit, Deribit, Binance)
2. Use FetchExchangeSymbols tool
3. Ask which symbol to trade
4. Use FetchSymbolPrice tool
5. Ask for quantity and desired OTC price
6. Confirm: "Just to confirm, you want X units of SYMBOL on EXCHANGE at PRICE, correct?"`,
    voice: "maya",
    language: "ENG",
    first_sentence: "Hello! Which exchange would you like to trade on?",
    tools: [symbolToolId, priceToolId],
    analysis_schema: {
      exchange: "string",
      symbol: "string",
      current_price: "number",
      quantity: "string",
      price: "string",
      confirmed: "boolean"
    }
  };

  try {
    const res = await axios.post(
      'https://api.bland.ai/v1/agents',
      agentConfig,
      { headers: { Authorization: `Bearer ${process.env.BLAND_API_KEY}` } }
    );
    console.log('Created agent ID:', res.data.agent.agent_id);
  } catch (err) {
    console.error('Create Agent failed:', err.response?.data || err.message);
  }
}

createAgent();