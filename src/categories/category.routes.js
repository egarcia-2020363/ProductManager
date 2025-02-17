import { Router } from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { createCategory, deleteCategory, get, getAll, update } from './category.controller.js'

const api = Router()

api.get('/getAllCategories', [validateJwt], getAll)
api.get('/getCategory/:id', [validateJwt], get)
api.put('/updateCategory/:id', [validateJwt], update)
api.delete('/deleteCategory/:id', [validateJwt], deleteCategory)
api.post('/createCategory', [validateJwt], createCategory)

export default api