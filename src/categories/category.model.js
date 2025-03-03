//Modelo de Categoria

import { Schema, model } from "mongoose"

const categorySchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`]            
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [25, `Can't be overcome 25 characters`]            
        },
        status:{
            type: Boolean, 
            default: true
        }
    }
)

//Modificar el toJSON para excluir datos en la respuesta
categorySchema.methods.toJSON = function(){
    const { __v, status, _id, ...category} = this.toObject() //sirve para convertir un documento de MongoDB a un objeto de javaScript
    return category
}

//Crear y exportar el modelo
export default model('Category', categorySchema)