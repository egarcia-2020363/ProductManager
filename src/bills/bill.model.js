import { Schema, model } from 'mongoose'

const billSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            product: { 
                type: Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true } 
        }
    ],
    total: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['PAID', 'PENDING', 'CANCELLED'],
        default: 'PAID' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now }
})

billSchema.methods.toJSON = function(){
    const { __v, status, _id, ...bill} = this.toObject() 
    return bill
}

export default model('Bill', billSchema)
