//Rutas del usuario
import { Router } from 'express'
import { deleteItself, deleteUser, get, getAll, update, updateItself, updatePassword} from './user.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { privateUpdateValidator, updateValidator } from '../../helpers/validators.js'

const api = Router()

api.get('/getAllUsers', [validateJwt], getAll)
api.get('/getUser/:id', [validateJwt], get)
api.put('/updatePassword', [validateJwt], updatePassword)
api.put('/privateUpdateUser/:id', validateJwt, privateUpdateValidator, update)
api.put('/updateUser/:id', validateJwt, updateValidator, updateItself)
api.delete('/privateDeleteUser/:id', [validateJwt], deleteUser)
api.delete('/deleteUser/:id', [validateJwt], deleteItself)
export default api