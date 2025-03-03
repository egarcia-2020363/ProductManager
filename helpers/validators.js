//Validar campos en las rutas
import { body } from "express-validator" // capturar todo el body de la solicitud
import { validateErrors } from "./validate.errors.js"
import { existUsername, objectIdValid } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name is required').notEmpty(),
    body('surname', 'Surname is required').notEmpty(),
    body('email', 'Email is required or is not a valid email').notEmpty().isEmail(),
    body('username', 'Username is required').notEmpty().isLowercase().custom(existUsername),
    body('password', 'Password is required').notEmpty().isStrongPassword().withMessage('Please write a stronger password').isLength({min: 8}),
    body('phone', 'Phone is required or is not a valid phone').notEmpty().isMobilePhone(),
    validateErrors
]

export const saveUserValidator = [
    body('name', 'Name is required').notEmpty(),
    body('surname', 'Surname is required').notEmpty(),
    body('email', 'Email is required or is not a valid email').notEmpty().isEmail(),
    body('username', 'Username is required').notEmpty().isLowercase().custom(existUsername),
    body('password', 'Password is required').notEmpty().isStrongPassword().withMessage('Please write a stronger password').isLength({min: 8}),
    body('phone', 'Phone is required or is not a valid email').notEmpty().isMobilePhone(),
    body('role', 'Role is required').notEmpty(),
    validateErrors
]

export const loginValidator = [
    body('userLoggin', 'Username or email is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
    validateErrors
]

export const updateValidator = [
    body('name', 'Name is required').optional().notEmpty(),
    body('surname', 'Surname is required').optional().notEmpty(),
    body('email', 'Email is required').optional().notEmpty(),
    body('phone', 'Phone is required or is not a valid email').optional().notEmpty().isMobilePhone(),
    validateErrors
]

export const privateUpdateValidator = [
    body('name', 'Name is required').optional().notEmpty(),
    body('surname', 'Surname is required').optional().notEmpty(),
    body('email', 'Email is required').optional().notEmpty(),
    body('phone', 'Phone is required or is not a valid email').optional().notEmpty().isMobilePhone(),
    body('uRole', 'Role is required').notEmpty(),
    validateErrors
]
