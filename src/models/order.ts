type Order = {
    price: string,
    qty: string,
}

type OrderResponse = {
    lastUpdatePriceId: number,
    bids: Array<Array<string>>,
    asks: Array<Array<string>>,
}

export {
    Order,
    OrderResponse
}