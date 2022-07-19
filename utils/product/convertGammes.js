const Gammes = require("../../models/Gamme.model");

class ConvertGamme {
    constructor(product) {
        this._product = product;
        this._stock = product.stock;
        this._gamme = product.gamme;
        this._gammesValue = product.gammesValue;
    }

    get getSplitGammes() { return this.splitGamme() };
    get getSplitGammesValue() { return this.splitGammesValue() };
    get getCombineGammes() { return this.combineGammes() };
    get getFinalProduct() { return this.finalProduct() };

    splitGamme() {

        return this._gamme.replace('¤', ' ').split(' ');
    }
    splitGammesValue() {

        return this._gammesValue.replace('¤', ' ').split(' ');
    }
    combineGammes() {
        console.log('splitGamme():', this.splitGamme())
        console.log('splitGammesValue():', this.splitGammesValue())

    }
    finalProduct() {
        this.combineGammes()
    }
}

module.exports = ConvertGamme;