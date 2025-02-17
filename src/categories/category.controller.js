//Logica de negocio
import Category from './category.model.js'
import Product from '../products/product.model.js'

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        const { role, status } = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'You cant create a category'})
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).send({ success: false, message: 'Category already exists' })
        }

        const category = new Category({ name, description })
        await category.save()

        return res.status(201).send({ success: true, message: 'Category created successfully', category: category })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ success: false, message: 'General error', error: e })
    }
}

export const getAll = async(req, res)=>{
    try {

        const {status} = req.user

        if (status === false){
            return res.status(403).send({message: 'Your user is not a valid user'})
        }

        const { limit = 20, skip = 0} = req.query
        const categories = await Category.find({ status: true})
            .skip(skip)
            .limit(limit)

        if(categories.length === 0) return res.status(404).send({message: 'Categories not found'})
        return res.send({succes: true, message: 'Categories found', categories, total: categories.length})
    } catch (e) {
        console.error(e)
        return res.status(500).send({message: 'General error', e})
    }
}

export const get = async(req, res)=>{
    try {

        const {status} = req.user

        if (status === false){
            return res.status(403).send({message: 'Your user is not a valid user'})
        }

        const { id } = req.params
        const category = await Category.findById(id)

        if(!category || category.status === false) return res.status(404).send(
            {
                succes: false,
                message: 'Category not found'
            }
        )
        return res.send({
            succes: true,
            message: 'Category found',
            category
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                e
            }
        )
    }
}

export const deleteCategory = async(req, res)=>{
    try {

        const { role, status } = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'You cant delete this category'})
        }

        const { id } = req.params
        const category = await Category.findById(id)

        if(!category || category.status === false) return res.status(404).send(
            {
                succes: false,
                message: 'Something went wrong, category might not exist'
            }
        )

        const defaultCategory = await Category.findOne({ name: 'General'})

        await Product.updateMany(
            { category: id }, 
            { category: defaultCategory._id } 
        )

        category.status = false
        await category.save()

        return res.send({
            success: true,
            message: 'Category deleted succesfully'
        })

    } catch (e) {
        console.error(e)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                e
            }
        )
    }
}

export const update = async(req, res)=>{
    try{

        const {role, status} = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'You cant update this category'})
        }

        const { id } = req.params
        let { name, description  } = req.body

        const category = await Category.findById(id)
        if(!category || category.status === false) {
            return res.status(400).send(
                {
                    succes: false,
                    message: 'Category not found'
                }
            ) 
        } 

        if (name !== undefined && name.trim() === "") {
            name = category.name
        }
        if (description !== undefined && description.trim() === "") {
            description = category.description
        }

        if (name) category.name = name
        if (description) category.description = description
            
        await category.save()
            
        return res.send(
            {
                success: true,
                message: 'Category updated',
                category
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                e
            }
        )
    }
}