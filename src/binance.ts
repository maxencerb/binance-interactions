import fetch from 'node-fetch';
import { Candle, CandleResponse } from './models/candle';
import { Order, OrderResponse } from './models/order';

const BASE_ENDPOINT = "https://api.binance.com";

const get_all_trading_pairs = async (): Promise<string[]> => {
    const response = await fetch(`${BASE_ENDPOINT}/api/v3/exchangeInfo`);
    const json: any = await response.json();
    return json.symbols.map((symbol: any) => symbol.symbol as string);
}

const get_candle_stick = async (symbol: string, interval: string, start_time=Date.now() - (1000 * 60 * 60), end_time=Date.now()): Promise<Candle[]> => {
    const response = await fetch(`${BASE_ENDPOINT}/api/v3/klines?symbol=${symbol}&interval=${interval}${start_time ? `&startTime=${start_time}` : ''}${start_time ? `&endTime=${end_time}` : ''}`);
    const json = await response.json() as CandleResponse;
    return json.map(from_list_to_candle);
}

const from_list_to_candle = (list: Array<number | string>): Candle => {
    const obj: Candle = {
        openTime: list[0],
        open: list[1],
        high: list[2],
        low: list[3],
        close: list[4],
        volume: list[5],
        closeTime: list[6]
    } as Candle;
    return obj;
}

const from_list_to_order = (list: Array<string>): Order => {
    const obj: Order = {
        price: list[0],
        qty: list[1],
    }
    return obj;
}

const getDepth = async (direction: 'asks' | 'bids' = 'asks', pair = 'BTCUSDT', limit = 10): Promise<Order[]> => {
    const response = await fetch(`${BASE_ENDPOINT}/api/v3/depth?symbol=${pair}&limit=${limit}`);
    const json = await response.json() as OrderResponse;
    return json[direction].map(from_list_to_order);
}

export {
    get_all_trading_pairs,
    get_candle_stick,
    getDepth
}