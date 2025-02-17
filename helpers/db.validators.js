
import User from '../src/users/user.model.js'
import { isValidObjectId } from 'mongoose'

export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const objectIdValid = async(objectId)=>{
    console.log(isValidObjectId(objectId))
    if(!isValidObjectId(objectId)){
        throw new Error('Is not an objectId valid')
    }
}