import ShoppingCart from './shoppingCart.model.js';
import User from '../user/user.model.js';
import Product from '../products/product.model.js';

export const createShoppingCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Verificar si el usuario y el producto existen
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({
                message: 'User or product not found'
            });
        }

        // Crear el carrito de compras
        const shoppingCart = new ShoppingCart({
            user: userId,
            items: [{
                product: productId,
                quantity,
                price: product.price
            }]
        });


        const totalPrice = product.price * quantity;
        shoppingCart.totalPrice = totalPrice;

        await shoppingCart.save();

        res.status(201).json({
            message: 'Shopping cart created successfully',
            shoppingCart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating shopping cart',
            error: error.message
        });
    }
};

export const getShoppingCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar el carrito de compras del usuario
        const shoppingCart = await ShoppingCart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price'
            });

        res.status(200).json({
            message: 'Shopping cart retrieved successfully',
            shoppingCart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving shopping cart',
            error: error.message
        });
    }
};

export const getShoppingCar = async (req = request, res = response) => {
    const { limite, desde } = req.body;
    const query = { state: true }

    const [total, shoppingCart] = await Promise.all([
        ShoppingCart.countDocuments(query),
        ShoppingCart.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        shoppingCart
    })

}