const axios = require('axios');

const EXCHANGE_APIS = {
  okx: 'https://www.okx.com/api/v5',
  bybit: 'https://api.bybit.com/v5',
  deribit: 'https://www.deribit.com/api/v2',
  binance: 'https://api.binance.com/api/v3'
};

class ExchangeService {
  async getSymbols(exchange) {
    let url, symbolPath;
    switch (exchange.toLowerCase()) {
      case 'okx':
        url = `${EXCHANGE_APIS.okx}/public/instruments?instType=SPOT`;
        symbolPath = 'data';
        break;
      case 'bybit':
        url = `${EXCHANGE_APIS.bybit}/market/instruments-info?category=spot`;
        symbolPath = 'result.list';
        break;
      case 'deribit':
        url = `${EXCHANGE_APIS.deribit}/public/get_instruments?currency=BTC&kind=future`;
        symbolPath = 'result';
        break;
      case 'binance':
        url = `${EXCHANGE_APIS.binance}/exchangeInfo`;
        symbolPath = 'symbols';
        break;
      default:
        throw new Error('Unsupported exchange');
    }

    const response = await axios.get(url);
    return this.extractSymbols(response.data, symbolPath, exchange).slice(0, 20);
  }

  async getPrice(exchange, symbol) {
    let url, priceField;
    switch (exchange.toLowerCase()) {
      case 'okx':
        url = `${EXCHANGE_APIS.okx}/market/ticker?instId=${symbol}`;
        priceField = 'data.0.last';
        break;
      case 'bybit':
        url = `${EXCHANGE_APIS.bybit}/market/tickers?category=spot&symbol=${symbol}`;
        priceField = 'result.list.0.lastPrice';
        break;
      case 'deribit':
        url = `${EXCHANGE_APIS.deribit}/public/ticker?instrument_name=${symbol}`;
        priceField = 'result.last_price';
        break;
      case 'binance':
        url = `${EXCHANGE_APIS.binance}/ticker/price?symbol=${symbol}`;
        priceField = 'price';
        break;
      default:
        throw new Error('Unsupported exchange');
    }

    const response = await axios.get(url);
    return parseFloat(this.extractPrice(response.data, priceField));
  }

  extractSymbols(data, path, exchange) {
    const symbols = this.getNestedValue(data, path) || [];
    return symbols.map(item => {
      switch (exchange.toLowerCase()) {
        case 'okx': return item.instId;
        case 'bybit': return item.symbol;
        case 'deribit': return item.instrument_name;
        case 'binance': return item.symbol;
        default: return item;
      }
    });
  }

  extractPrice(data, path) {
    return this.getNestedValue(data, path);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
  }
}

module.exports = new ExchangeService();