import Product from './product.model.js'
import Category from '../categories/category.model.js'

export const getAll = async (req, res) => {
    try {
        const { status } = req.user

        if (status === false) {
            return res.status(403).send({ message: 'Your user is not a valid user' })
        }

        const { limit = 20, skip = 0 } = req.query
        const products = await Product.find({ status: true })
            .skip(Number(skip))
            .limit(Number(limit))

        if (products.length === 0) {
            return res.status(404).send({ success: false, message: 'Products not found' })
        }

        return res.send({ success: true, message: 'Products found', products, total: products.length })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}

export const get = async (req, res) => {
    try {
        const { status } = req.user

        if (status === false) {
            return res.status(403).send({ message: 'Your user is not a valid user' })
        }

        const { id } = req.params
        const product = await Product.findById(id).populate("category") 

        if (!product || product.status === false) {
            return res.status(404).send({ success: false, message: 'Product not found' })
        }

        return res.send({ success: true, message: 'Product found', product })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { role, status } = req.user

        if (role !== 'ADMIN' || status === false) {
            return res.status(403).send({ message: 'You cant delete this product' })
        }

        const { id } = req.params
        const product = await Product.findById(id)

        if (!product || product.status === false) {
            return res.status(404).send({ success: false, message: 'Something went wrong, product might not exist' })
        }

        product.status = false
        await product.save()

        return res.send({ success: true, message: 'Product deleted successfully' })

    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}

export const update = async (req, res) => {
    try {
        const { role, status } = req.user

        if (role !== 'ADMIN' || status === false) {
            return res.status(403).send({ message: 'You cant update this product' })
        }

        const { id } = req.params
        let { name, description, price, stock, category } = req.body

        const product = await Product.findById(id)
        if (!product || product.status === false) {
            return res.status(404).send({ success: false, message: 'Product not found' })
        }

        // Validaciones para evitar valores vacíos
        if (name !== undefined && name.trim() === "") {
            name = product.name
        }
        if (description !== undefined && description.trim() === "") {
            description = product.description
        }
        if (price !== undefined && isNaN(price)) {
            price = product.price
        }
        if (stock !== undefined && isNaN(stock)) {
            stock = product.stock
        }
        if (category !== undefined && category.trim() === "") {
            category = product.category
        }

        // Actualizar solo si hay cambios
        if (name) product.name = name
        if (description) product.description = description
        if (price) product.price = price
        if (stock) product.stock = stock
        if (category) product.category = category

        await product.save()

        return res.send({ success: true, message: 'Product updated', product })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}


export const getTopSelling = async (req, res) => {
    try {
        const products = await Product.find({ status: true }).sort({ sold: -1 })
        if (products.length === 0) {
            return res.status(404).send({ success: false, message: 'No top-selling products found' })
        }
        return res.send({ success: true, message: 'Top-selling products found', products })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}

export const getOutOfStock = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 })
        if (products.length === 0) {
            return res.status(404).send({ success: false, message: 'No out-of-stock products found' })
        }
        return res.send({ success: true, message: 'Out-of-stock products found', products })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {

        const { role, status } = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'You cant create a product'})
        }

        const { name, description, price, stock, category } = req.body

        const existingCategory = await Category.findById(category)
        if (!existingCategory || existingCategory.status === false) {
            return res.status(400).send({ success: false, message: 'Invalid category' })
        }

        const newProduct = new Product({ name, description, price, stock, category })
        await newProduct.save()
        return res.status(201).send({ success: true, message: 'Product created successfully', product: newProduct })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}