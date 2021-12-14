type Candle = {
    openTime: number,
    open: string,
    high: string,
    low: string,
    close: string,
    volume: string,
    closeTime: number
}

type CandleResponse = Array<Array<string | number>>

export {
    Candle,
    CandleResponse
}