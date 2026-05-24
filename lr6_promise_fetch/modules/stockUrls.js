class StockUrls {
    constructor() {
        this.baseUrl = '';
    }

    getStocks() {
        return `${this.baseUrl}/products`;
    }

    getStockById(id) {
        return `${this.baseUrl}/products/${id}`;
    }

    createStock() {
        return `${this.baseUrl}/products`;
    }

    removeStockById(id) {
        return `${this.baseUrl}/products/${id}`;
    }

    updateStockById(id) {
        return `${this.baseUrl}/products/${id}`;
    }
}

export const stockUrls = new StockUrls();
