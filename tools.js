// tools.js
const axios = require('axios');
require('dotenv').config();

const BLAND_BASE_URL = 'https://api.bland.ai/v1';
const BLAND_API_KEY = process.env.BLAND_API_KEY;

const createSymbolTool = async () => {
  const config = {
    name: "FetchExchangeSymbols",
    description: "Fetch available trading symbols from a crypto exchange",
    speech: "Fetching available symbols for you",
    url: `${process.env.PUBLIC_WEBHOOK_URL}/api/symbols`,
    method: "POST",
    timeout: 10000,
    body: {
      exchange: "{{input.exchange}}"
    },
    input_schema: {
      type: "object",
      properties: {
        exchange: { type: "string", description: "Exchange name (okx, bybit, etc.)" }
      },
      required: ["exchange"],
      example: { exchange: "binance" }
    },
    response: {
      symbols: "$.symbols",
      exchange_name: "$.exchange"
    }
  };

  const res = await axios.post(`${BLAND_BASE_URL}/tools`, config, {
    headers: { Authorization: `Bearer ${BLAND_API_KEY}` }
  });

  return res.data.tool_id;
};

const createPriceTool = async () => {
  const config = {
    name: "FetchSymbolPrice",
    description: "Fetch market price of a symbol on an exchange",
    speech: "Getting the current price",
    url: `${process.env.PUBLIC_WEBHOOK_URL}/api/price`,
    method: "POST",
    timeout: 10000,
    body: {
      exchange: "{{input.exchange}}",
      symbol: "{{input.symbol}}"
    },
    input_schema: {
      type: "object",
      properties: {
        exchange: { type: "string" },
        symbol: { type: "string" }
      },
      required: ["exchange", "symbol"],
      example: { exchange: "binance", symbol: "BTCUSDT" }
    },
    response: {
      current_price: "$.price",
      symbol: "$.symbol"
    }
  };

  const res = await axios.post(`${BLAND_BASE_URL}/tools`, config, {
    headers: { Authorization: `Bearer ${BLAND_API_KEY}` }
  });

  return res.data.tool_id;
};

(async () => {
  const symbolTool = await createSymbolTool();
  const priceTool = await createPriceTool();
  console.log("Symbol Tool ID:", symbolTool);
  console.log("Price Tool ID:", priceTool);
})();
