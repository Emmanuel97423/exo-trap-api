'use strict'

class Lineitems {
    constructor(data) {
        this._data = data
        this._currency = "eur"
        this._name = data.name
        this._unit_amount = data.priceHt
        this._quantity = data.orderQuantity


    }
    get data() { return this._data }
    set data(data) { this._data = data }

    get currency() { return this._currency }
    get name() { return this._name }
    get unitAmount() { return this._unit_amount }
    get quantity() { return this._quantity }

    get product() { return this.product() }

    productItems() {
        return {
            price_data: {
                currency: this._currency,
                product_data: {
                    name: this._name,
                },
                unit_amount: Math.round(this._unit_amount * 100),
            },
            quantity: this._quantity,
        }

    }
}

module.exports = { Lineitems }
