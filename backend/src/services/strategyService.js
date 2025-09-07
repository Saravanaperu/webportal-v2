import * as angelOneService from './angelOneService.js';
// import { RSI, EMA } from 'technicalindicators';

let isActive = false;
let strategyName = null;
let priceData = {}; // To store recent prices for TA calculations

// This is a simplified, dummy strategy logic.
// A real strategy would be much more complex.
const executeDummyStrategy = (tick) => {
  if (!priceData[tick.tk]) {
    priceData[tick.tk] = [];
  }
  priceData[tick.tk].push(parseFloat(tick.ltp));

  // Keep only the last 50 prices for this example
  if (priceData[tick.tk].length > 50) {
    priceData[tick.tk].shift();
  }

  const prices = priceData[tick.tk];
  if (prices.length < 2) return; // Need at least 2 prices to compare

  const currentPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];

  // Dummy logic: If price increases by 0.1%, "buy".
  if (currentPrice > prevPrice * 1.001) {
    console.log(`[${strategyName}] DUMMY BUY SIGNAL for ${tick.tk} at ${currentPrice}`);
    // In a real app, you would place an order here:
    // angelOneService.placeOrder({ symbol: tick.symbol, side: 'BUY', ... });
  }
};

export const onTick = (ticks) => {
  if (!isActive) return;

  ticks.forEach(tick => {
    executeDummyStrategy(tick);
  });
};

export const start = (name) => {
  if (isActive) {
    console.log(`Strategy '${strategyName}' is already running.`);
    return;
  }
  strategyName = name;
  isActive = true;
  priceData = {}; // Reset price data
  console.log(`Strategy '${strategyName}' started.`);
};

export const stop = () => {
  if (!isActive) {
    console.log('No strategy is currently running.');
    return;
  }
  console.log(`Strategy '${strategyName}' stopped.`);
  isActive = false;
  strategyName = null;
};

export const getStatus = () => {
  return { isActive, strategyName };
};
