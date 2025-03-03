import Bill from './bill.model.js'
import Cart from '../carts/cart.model.js'
import Product from '../products/product.model.js'

// Crear una factura (Finalizar compra)
export const createBill = async (req, res) => {
    try {
        const { uid } = req.user
        const cart = await Cart.findOne({ user: uid }).populate('items.product')
        if (!cart || cart.items.length === 0) {
            return res.status(400).send({ message: 'Cart is empty' })
        }
        
        let total = 0
        for (let item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).send({ message: `Not enough stock for ${item.product.name}` })
            }
            total += item.quantity * item.product.price
            item.product.stock -= item.quantity
            item.product.sold += item.quantity
            await item.product.save()
        }
        
        const newBill = new Bill({
            user: uid,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total
        })
        
        await newBill.save()
        cart.items = []
        await cart.save()
        
        return res.status(201).send(
            { 
                success: true, 
                message: 'Bill created', 
                newBill
            }
        )
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'General error', error: e })
    }
}

// Obtener historial de facturas de un usuario
export const getUserBills = async (req, res) => {
    try {
        const { uid } = req.user
        const bills = await Bill.find({ user: uid }).populate('items.product')
        if (!bills.length) {
            return res.status(404).send({ message: 'No bills found' })
        }
        return res.send(
            { 
                success: true, 
                bills 
            }
        )
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'General error', error: e })
    }
}

// Obtener detalles de una factura específica
export const getBillDetails = async (req, res) => {
    try {
        const { id } = req.params
        const bill = await Bill.findById(id).populate('items.product user.username')
        if (!bill) {
            return res.status(404).send({ message: 'Bill not found' })
        }
        return res.send(
            { 
                success: true, 
                bill 
            }
        )
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'General error', error: e })
    }
}

// Editar una factura (Solo ADMIN)
export const updateBill = async (req, res) => {
    try {
        const { role } = req.user
        if (role !== 'ADMIN') {
            return res.status(403).send({ message: 'Only admin can update bills' })
        }
        
        const { id } = req.params
        const { status, items } = req.body

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).send({ message: "Items array is required and must not be empty" })
        }

        const bill = await Bill.findById(id).populate('items.product')
        if (!bill) {
            return res.status(404).send({ message: 'Bill not found' })
        }

        for (let item of bill.items) {
            const product = await Product.findById(item.product._id)
            if (product) {
                product.stock += item.quantity
                await product.save()
            }
        }

        let total = 0
        let updatedItems = []

        for (let item of items) {
            const product = await Product.findById(item.product)
            if (!product || product.stock < item.quantity) {
                return res.status(400).send(
                    { 
                        success: false,
                        message: `Not enough stock for ${product?.name || 'unknown product'}` 
                    }
                )
            }
            
            product.price = item.price
            total += item.quantity * product.price
            product.stock -= item.quantity
            product.sold += item.quantity
            await product.save()
            
            updatedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            })
        }

        bill.items = updatedItems
        bill.total = total
        if (status) bill.status = status

        await bill.save()
        return res.send(
            {
                success: true, 
                message: 'Bill updated', 
                bill
            }
        )
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'General error', error: e })
    }
}
