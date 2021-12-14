type Order = {
    price: string,
    qty: string,
}

type OrderBook = {
    lastUpdatePriceId: number,
    bids: Array<Array<string>>,
    asks: Array<Array<string>>,
}

export {
    Order,
    OrderBook
}