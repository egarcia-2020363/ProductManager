// Rutas para las facturas (bills)
import { Router } from 'express'
import { createBill, getUserBills, getBillDetails, updateBill } from './bill.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post('/createBill', [validateJwt], createBill)
api.get('/getUserBills', [validateJwt], getUserBills)
api.get('/getBillDetails/:id', [validateJwt], getBillDetails)
api.put('/updateBill/:id', [validateJwt], updateBill)

export default api