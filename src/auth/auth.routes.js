//Rutas de autenticacion
import { Router } from 'express'
import { register, test, login, saveUser } from './auth.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator, saveUserValidator } from '../../helpers/validators.js'

const api = Router()

//Rutas publicas
api.post(
    '/register', 
    [registerValidator],
    register)

api.post(
    '/login', 
    [loginValidator], 
    login)

api.post(
    '/saveUser', 
    saveUserValidator, validateJwt,
    saveUser)

//Rutas privadas
                 //middleware
api.get('/test', validateJwt, test)
//Exportar
export default api