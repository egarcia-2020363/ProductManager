//Middleware de validacion de tokens
'use strict'

import jwt from 'jsonwebtoken'

export const validateJwt = async(req, res, next)=>{
    try {
        let secretKey = process.env.SECRET_KEY

        let { authorization } = req.headers

        if(!authorization) return res.status(401).send({message: 'Unauthorized'})

        const user = jwt.verify(authorization, secretKey)

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user

        next()
    } catch (e) {
        console.error(e)
        return res.status(401).send({message: 'invalid token or expired'})
    }
}