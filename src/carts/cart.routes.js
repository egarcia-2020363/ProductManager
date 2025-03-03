// Rutas para los carritos (carts)
import { Router } from 'express'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addToCart, getCart, removeFromCart, clearCart } from './cart.controller.js'

const api = Router()

api.post('/addToCart', [validateJwt], addToCart)
api.get('/getCart', [validateJwt], getCart)
api.delete('/removeFromCart/:productId', [validateJwt], removeFromCart)
api.delete('/clearCart', [validateJwt], clearCart)

export default api