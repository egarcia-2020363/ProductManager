import { Schema, model } from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
})


cartSchema.methods.toJSON = function () {
    const { __v, id_, status, ...cart } = this.toObject()
    return cart
}

export default model("Cart", cartSchema)
