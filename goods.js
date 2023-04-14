class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }

    setAvailable(available) {
        this.available = available;
    }
}

class GoodsList {
    #goods;

    constructor(goods, filter, sortPrice, sortDir) {
        this.#goods = goods;
        this.filter = RegExp(filter, "i");
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        let filtered = this.#goods.filter(good => this.filter.test(good.name) && good.available == true);
        if (this.sortPrice) {
            if (this.sortDir == true) {
                return filtered.sort((a, b) => a.price - b.price);
            } else {
                return filtered.sort((a, b) => b.price - a.price);
            }
        } else {
            return filtered;
        }
    }

    add(good) {
        this.#goods.push(good);
    }

    remove(id) {
        this.#goods = this.#goods.filter(good => good.id !== id);
    }
}

class BasketGood extends Good {
    constructor(good, amount) {
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount;
    }
}

class Basket {
    constructor(goods) {
        this.goods = goods;
    }
    
    get totalAmount() {
        return this.goods.reduce((sum, good) => sum + good.amount, 0);
    }

    get totalSum() {
        return this.goods.reduce((sum, {price, amount}) => sum + price * amount, 0);
    }

    add(good, amount) {
        if (this.goods.some(item => item.id === good.id)){
            let item = this.goods.find(item => item.id === good.id);
            item.amount += amount;
        } else {
            this.goods.push(new BasketGood(good, amount));
        }
    }

    remove(good, amount) {
        if (this.goods.some(item => item.id === good.id)){
            let item = this.goods.find(item => item.id === good.id);
            item.amount -= amount;
            if (item.amount <= 0) {
                this.goods = this.goods.filter(good => good.id !== item.id);
            }
        } 
    }

    clear() {
        this.goods = [];
    }

    removeUnavailable() {
        this.goods = this.goods.filter(good => good.available !== false);
    }
}

const good = new Good(0, "T-shirt", "Round neck T-shirt with short sleeves", ["XS", "S", "M", "L", "XL"], 25, true)
const good1 = new Good(1, "Jeans", "Mid rise jeans with belt loops.", ["XS", "S", "M", "L", "XL"], 45, false)
const good2 = new Good(2, "Denim Shirts", "High rise five pocket shorts.", ["XS", "S", "M", "L", "XL"], 30, false)
const good3 = new Good(3, "Cargo Pants", "Mid-rise pants made of cupro.", ["XS", "S", "M", "L", "XL"], 55, true)
const good4 = new Good(4, "Oversized Shirt", "Shirt with lapel collar and long sleeves.", ["XS", "S", "M", "L", "XL"], 46, true)

const lst = new GoodsList([good, good1, good2], 'shirt', true, false)
lst.add(good4)
lst.remove(good2)
console.log(lst.list)

cart = new Basket([])
cart.add(good, 1)
cart.add(good2, 3)
cart.add(good4, 5)
console.log(cart.totalAmount)
console.log(cart.totalSum)

cart.remove(good4, 2)
console.log(cart)

cart.removeUnavailable()
console.log(cart)

cart.clear()
console.log(cart)