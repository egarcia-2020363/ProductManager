//Conexion a la db
import mongoose from 'mongoose'

export const connect = async()=>{
    try {
        //Ciclo de vida de Mongo
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connect to mongodb')
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | try conecting')
        })
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | Connected to MongoDB')
        })
        mongoose.connection.once('open', ()=>{
            console.log('MongoDB | connected to databse')
        })
        mongoose.connection.on('reconnected',()=>{
            console.log('MongoDB | reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected')
        })

        //Conectarse a la DB
        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50, //Maximo de conexiones
                serverSelectionTimeoutMS: 5000 //Tiempo maximo para intentar conectarse
            }
        )
    } catch (e) {
        console.error('Database connection failed', e)
    }
}