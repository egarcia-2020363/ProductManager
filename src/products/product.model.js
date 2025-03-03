//Modelo de Producto

import { Schema, model, mongoose } from "mongoose";

const productSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [50, `Can't exceed 50 characters`]            
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [200, `Can't exceed 200 characters`]            
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative']
        },
        category: {
            type: Schema.Types.ObjectId, 
            ref: "Category",
            required: [true, 'Category is required']
        },
        sold: {
            type: Number,
            default: 0
        },
        status: {
            type: Boolean, 
            default: true
        }
    }
)

//Modificar el toJSON para excluir datos en la respuesta
productSchema.methods.toJSON = function(){
    const { __v, status, _id, ...product} = this.toObject() //sirve para convertir un documento de MongoDB a un objeto de javaScript
    return product
}

//Crear y exportar el modelo
export default model('Product', productSchema)