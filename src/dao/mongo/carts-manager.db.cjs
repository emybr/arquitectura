const Database =  require('../../config/config.cjs');

class CartsManagerDb {
    constructor() {
        this.db = new Database();
    }


    async addCart(email) {
        try {
            if (!this.cartsCollection) {
                await this.db.connectToDatabase();
            }
            const result = await this.cartsCollection.insertOne({ email, products: [] });
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    // esta opcion trabaja con el id del carrito

    // async addProductToCart(cartId, product) {
    //   console.log(product);
    //   try {
    //     if (!this.cartsCollection) {
    //       await this.connectToDatabase();
    //     }
    //     const cart = await this.cartsCollection.findOne({ _id: cartId });
    //     if (cart) {
    //       const existingProduct = cart.products.find(p => p.id === product.id);
    //       if (existingProduct) {
    //         existingProduct.quantity++;
    //       } else {
    //         product.quantity = 1;
    //         const cartProduct = {
    //           id: product.id,
    //           title: product.title,
    //           description: product.description,
    //           price: product.price,
    //           thumbnail: product.thumbnail,
    //           code: product.code,
    //           stock: product.stock,
    //           quantity: 1
    //         };
    //         cart.products.push(cartProduct);
    //       }
    //       await this.cartsCollection.updateOne({ _id: cartId }, { $set: { products: cart.products } });
    //       console.log("Producto agregado al carrito");
    //     } else {
    //       await this.cartsCollection.insertOne({
    //         _id: cartId,
    //         timestamp: new Date(),
    //         products: [{
    //           id: product.id,
    //           title: product.title,
    //           description: product.description,
    //           price: product.price,
    //           thumbnail: product.thumbnail,
    //           code: product.code,
    //           stock: product.stock,
    //           quantity: 1
    //         }]
    //       });
    //       console.log("Carrito creado y producto agregado");
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }


    // funciona bien trabaja con email

    async addProductToCart(email, product) {
        console.log(product);
        try {
            if (!this.db.cartsCollection) {
                await this.db.connectToDatabase();
            }
            const cart = await this.db.cartsCollection.findOne({ email });
            if (cart) {
                const existingProduct = cart.products.find(p => p.id === product.id);
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    product.quantity = 1;
                    const cartProduct = {
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        thumbnail: product.thumbnail,
                        code: product.code,
                        stock: product.stock,
                        quantity: 1
                    };
                    cart.products.push(cartProduct);
                }
                await this.db.cartsCollection.updateOne({ email }, { $set: { products: cart.products } });
                console.log("Producto agregado al carrito");
            } else {
                await this.db.cartsCollection.insertOne({
                    email: email,
                    timestamp: new Date(),
                    products: [{
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        thumbnail: product.thumbnail,
                        code: product.code,
                        stock: product.stock,
                        quantity: 1
                    }]
                });
                console.log("Carrito creado y producto agregado");
            }
        } catch (e) {
            console.error(e);
        }
    }


    async updateCartIdUser(email) {
        try {
            if (!this.db.cartsCollection || !this.usersCollection) {
                await this.db.connectToDatabase();
            }
            const cart = await this.db.cartsCollection.findOne({ email });
            if (cart) {
                await this.db.usersCollection.updateOne({ email }, { $set: { cartId: cart._id } });
                console.log("CartId actualizado para el usuario", email);
            } else {
                console.log("No se encontró un carrito para el usuario", email);
            }
        } catch (e) {
            console.error(e);
        }
    }


    async getTotalProducts() {
        try {
            if (!this.database) {
                await this.connectToDatabase();
            }
            const totalProducts = await this.database.countDocuments();
            return totalProducts;
        } catch (e) {
            console.error(e);
        }
    }


    async getTotalCarts() {
        try {
            if (!this.db.cartsCollection) {
                await this.db.connectToDatabase();
            }
            const totalCarts = await this.db.cartsCollection.countDocuments();
            return totalCarts;
        } catch (e) {
            console.error(e);
        }
    }

}

module.exports = CartsManagerDb;