import { EMA, RSI, ATR } from 'technicalindicators';
import prisma from '../prisma/client.js';
import * as angelOneService from './angelOneService.js';

let isActive = false;
let strategyName = null;
let strategyConfig = {
  emaPeriod: 20,
  rsiPeriod: 14,
  atrPeriod: 14,
  atrMultiplier: 1.5,
};

let symbolData = {};
let openTrades = {};

const updateIndicators = (symbol) => {
  const data = symbolData[symbol];
  if (!data || data.prices.length < strategyConfig.emaPeriod) return;

  data.ema = EMA.calculate({ period: strategyConfig.emaPeriod, values: data.prices }).pop();
  if (data.prices.length >= strategyConfig.rsiPeriod) {
    data.rsi = RSI.calculate({ period: strategyConfig.rsiPeriod, values: data.prices }).pop();
  }
  if (data.prices.length >= strategyConfig.atrPeriod) {
    const atrInput = { high: data.prices, low: data.prices, close: data.prices, period: strategyConfig.atrPeriod };
    data.atr = ATR.calculate(atrInput).pop();
  }
};

const executeScalperV1Strategy = (tick) => {
  const symbol = tick.tk;
  const data = symbolData[symbol];
  if (!data || !data.ema || !data.rsi || !data.atr) return;
  const currentPrice = data.prices[data.prices.length - 1];

  if (openTrades[symbol]) {
    const trade = openTrades[symbol];
    if (currentPrice >= trade.targetPrice) {
      console.log(`[Scalper V1] TAKE PROFIT for ${symbol} at ${currentPrice}`);
      delete openTrades[symbol];
    } else if (currentPrice <= trade.stopLossPrice) {
      console.log(`[Scalper V1] STOP LOSS for ${symbol} at ${currentPrice}`);
      delete openTrades[symbol];
    }
    return;
  }

  const prevPrice = data.prices[data.prices.length - 2];
  if (prevPrice <= data.ema && currentPrice > data.ema && data.rsi < 70) {
    console.log(`[Scalper V1] BUY SIGNAL for ${symbol} at ${currentPrice}`);
    const stopLossPrice = currentPrice - (data.atr * strategyConfig.atrMultiplier);
    const targetPrice = currentPrice + (2 * data.atr * strategyConfig.atrMultiplier);
    openTrades[symbol] = { entryPrice: currentPrice, stopLossPrice, targetPrice };
    angelOneService.placeOrder({ tradingsymbol: `${symbol}-EQ`, symboltoken: symbol, transactiontype: 'BUY', exchange: 'NSE', ordertype: 'LIMIT', producttype: 'INTRADAY', duration: 'DAY', price: currentPrice, quantity: 1 });
  }
};

const executeMomentumV2Strategy = (tick) => {
    const symbol = tick.tk;
    const data = symbolData[symbol];
    if (!data || !data.ema || !data.rsi) return;
    const currentPrice = data.prices[data.prices.length - 1];

    if (openTrades[symbol]) {
      if (currentPrice < data.ema) {
        console.log(`[Momentum V2] EXIT SIGNAL for ${symbol} at ${currentPrice}`);
        delete openTrades[symbol];
      }
      return;
    }

    if (data.rsi > 60 && currentPrice > data.ema) {
      const recentHigh = Math.max(...data.prices.slice(-20));
      if (currentPrice >= recentHigh) {
        console.log(`[Momentum V2] BUY SIGNAL for ${symbol} at ${currentPrice}`);
        openTrades[symbol] = { entryPrice: currentPrice };
        angelOneService.placeOrder({ tradingsymbol: `${symbol}-EQ`, symboltoken: symbol, transactiontype: 'BUY', exchange: 'NSE', ordertype: 'LIMIT', producttype: 'INTRADAY', duration: 'DAY', price: currentPrice, quantity: 1 });
      }
    }
};

const processTick = (tick) => {
  const symbol = tick.tk;
  if (!symbolData[symbol]) {
    symbolData[symbol] = { prices: [], ema: null, rsi: null, atr: null };
  }
  symbolData[symbol].prices.push(parseFloat(tick.ltp));
  if (symbolData[symbol].prices.length > 100) {
    symbolData[symbol].prices.shift();
  }
  updateIndicators(symbol);

  if (strategyName === 'Scalper V1') {
    executeScalperV1Strategy(tick);
  } else if (strategyName === 'Momentum V2') {
    executeMomentumV2Strategy(tick);
  }
};

export const onTick = (ticks) => {
  if (!isActive) return;
  ticks.forEach(processTick);
};

export const start = async (name) => {
  if (isActive) return;

  try {
    const config = await prisma.config.findFirst();
    if (config && config.strategyParams) {
      strategyConfig = { ...strategyConfig, ...config.strategyParams };
    }
  } catch (error) {
    console.error("Could not fetch strategy config, using defaults.", error);
  }

  strategyName = name;
  isActive = true;
  symbolData = {};
  openTrades = {};
  console.log(`Strategy '${strategyName}' started with config:`, strategyConfig);
};

export const stop = () => {
  if (!isActive) return;
  console.log(`Strategy '${strategyName}' stopped.`);
  isActive = false;
  strategyName = null;
};

export const getStatus = () => {
  return { isActive, strategyName };
};
