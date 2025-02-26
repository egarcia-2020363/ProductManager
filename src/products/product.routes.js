import { Router } from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { createProduct, deleteProduct, get, getAll, getByParameter, getTopSelling, update } from './product.controller.js'

const api = Router()

api.get('/getAllProducts', [validateJwt], getAll)
api.get('/getProduct/:id', [validateJwt], get)
api.post('/createProduct', [validateJwt], createProduct)
api.put('/updateProduct/:id', [validateJwt], update)
api.delete('/deleteProduct/:id', [validateJwt], deleteProduct)
api.get('/getTopSelling', [validateJwt], getTopSelling)
api.get('/getByParameter', [validateJwt], getByParameter)

export default api