class StockUrls {
    constructor() {
        this.baseUrl = '';  // пустой baseUrl — запросы идут на тот же origin
    }

    getStocks() {
        return `${this.baseUrl}/tickets`;
    }

    getStockById(id) {
        return `${this.baseUrl}/tickets/${id}`;
    }

    createStock() {
        return `${this.baseUrl}/tickets`;
    }

    removeStockById(id) {
        return `${this.baseUrl}/tickets/${id}`;
    }

    updateStockById(id) {
        return `${this.baseUrl}/tickets/${id}`;
    }
}

export const stockUrls = new StockUrls();
