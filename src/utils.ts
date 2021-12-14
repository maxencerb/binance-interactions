const get_candle_id = (candle: any, pair: string) => {
    return `${candle.openTime}_${pair}`;
}

export {
    get_candle_id
}