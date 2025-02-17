//Generador de tokens
'use strict'

import jwt from 'jsonwebtoken'

export const generateJwt = async(payload)=>{
    try {
        return jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: '8h', //Lo recomendable son 1 o 2
                algorithm: 'HS256'
            }
        )
    } catch (e) {
        console.error(e)
        return e
    }
}