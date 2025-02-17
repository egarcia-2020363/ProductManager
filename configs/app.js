//Configurar el servidor de express (http)

//Modular | + efectiva

'use strict'

// ECModules | ESModules
import express from 'express' // Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors'  // Acceso al API
import authRoutes from '../src/auth/auth.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import userRoutes from '../src/users/user.routes.js'
import categoryRoutes from '../src/categories/category.routes.js'
import productRoutes from '../src/products/product.routes.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('combined'))
}    

const routes = (app)=>{
    app.use(authRoutes)
            //pre ruta o ruta general
    app.use('/v1/user', userRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/product', productRoutes)
} 

//ESModules no acepta exports
export const initServer = async()=>{
    const app = express() //Instancia de express
    try {
        configs(app) //Aplicar configuraciones al servidor
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    } catch (e) {
        console.error('Server init failed', e)
    }
}