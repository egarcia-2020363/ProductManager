import Cart from "./cart.model.js"
import Product from "../products/product.model.js"

// Agregar producto al carrito
export const addToCart = async (req, res) => {
    try {
        const { uid } = req.user
        const { productId, quantity } = req.body

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).send({ message: "Invalid product or quantity" })
        }

        const product = await Product.findById(productId)
        if (!product || product.status === false || product.stock < quantity) {
            return res.status(400).send({ message: "Product not available or insufficient stock" })
        }

        let cart = await Cart.findOne({ user: uid })
        if (!cart) {
            cart = new Cart({ user: uid, items: [] })
        }

        const alreadyItem = cart.items.findIndex(item => item.product.toString() === productId)
        if (alreadyItem > -1) {
            cart.items[alreadyItem].quantity += Number(quantity)
            if(cart.items[alreadyItem].quantity > product.stock) 
                return res.status(400).send({ message: "Product not available or insufficient stock" })
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
        return res.send({ success: true, message: "Product added to cart", cart })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: "General error", error: e })
    }
}

// Obtener el carrito del usuario actual
export const getCart = async (req, res) => {
    try {
        const { uid } = req.user
        const cart = await Cart.findOne({ user: uid }).populate("items.product")
        if (!cart) {
            return res.status(404).send({ message: "Cart is empty" })
        }
        return res.send({ success: true, cart })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: "General error", error: e })
    }
}

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
    try {
        const { uid } = req.user
        const { productId } = req.params

        let cart = await Cart.findOne({ user: uid })
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" })
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId)
        await cart.save()

        return res.send({ success: true, message: "Product removed from cart" })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: "General error", error: e })
    }
}

// Vaciar el carrito tras finalizar la compra
export const clearCart = async (req, res) => {
    try {
        const { uid } = req.user
        let cart = await Cart.findOne({ user: uid })
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" })
        }

        cart.items = []
        await cart.save()

        return res.send({ success: true, message: "Cart cleared" })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: "General error", error: e })
    }
}
