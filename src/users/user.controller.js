//Logica de negocio
import User from './user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const getAll = async(req, res)=>{
    try {

        const {role, status} = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'User must be ADMIN or be active to get users👻'})
        }

        const { limit = 20, skip = 0} = req.query
        const users = await User.find({ status: true})
            .skip(skip)
            .limit(limit)

        if(users.length === 0) return res.status(404).send({message: 'Users not found'})
        return res.send({succes: true, message: 'Users found', users, total: users.length})
    } catch (e) {
        console.error(e)
        return res.status(500).send({message: 'General error', e})
    }
}

export const get = async(req, res)=>{
    try {

        const {role, status} = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'User must be ADMIN or be active to get users'})
        }

        const { id } = req.params
        const user = await User.findById(id)

        if(!user || user.status === false) return res.status(404).send(
            {
                succes: false,
                message: 'User not found'
            }
        )
        return res.send({
            succes: true,
            message: 'User found',
            user
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                e
            }
        )
    }
}

export const deleteUser = async(req, res)=>{
    try {

        const { role, status } = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'You cant delete this user'})
        }

        const { id } = req.params
        const user = await User.findById(id)

        if(!user || user.status === false || user.role === 'ADMIN') return res.status(404).send(
            {
                succes: false,
                message: 'Something went wrong, check out your permission'
            }
        )

        user.status = false
        await user.save()

        return res.send({
            success: true,
            message: 'User deleted succesfully'
        })

    } catch (e) {
        console.error(e)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                e
            }
        )
    }
}

export const deleteItself = async(req, res)=>{
    try {

        const {status, uid} = req.user

        if(status === false) return res.status(403).send(
            {
                success: false,
                message: 'User is not valid user'
            }
        )

        const { id } = req.params
        const password = req.body
        const user = await User.findById(id)

        if(!await checkPassword(user.password, password)) return res.status(403).send(
            {
                succes: false,
                message: 'Wrong password'
            }
        )

        if (uid !== id || user.status === false || !user){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You cant delete this user'
                }
            )
        }

        user.status = false
        await user.save()

        return res.send({
            success: true,
            message: 'User deleted succesfully'
        })

    } catch (e) {
        console.error(e)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                e
            }
        )
    }
}

export const update = async(req, res)=>{
    try{

        const {role, status} = req.user

        if (role !== 'ADMIN' || status === false){
            return res.status(403).send({message: 'You cant update user'})
        }

        const { id } = req.params
        let { name, surname, email, phone, uRole } = req.body

        const user = await User.findById(id)
        if(!user || user.status === false) {
            return res.status(400).send(
                {
                    succes: false,
                    message: 'User not found'
                }
            ) 
        } 
        
        if(user.role === 'ADMIN') return res.status(403).send(
            {
                success: false,
                message: 'You cant update another ADMIN'
            }
        )

        if (name !== undefined && name.trim() === "") {
            name = user.name
        }
        if (surname !== undefined && surname.trim() === "") {
            surname = user.surname
        }
        if (email !== undefined && email.trim() === "") {
            email = user.email
        }
        if (phone !== undefined && phone.trim() === "") {
            phone = user.phone
        }

        if (uRole !== undefined && uRole.trim() === "") {
            uRole = user.role
        }

        if (name) user.name = name
        if (surname) user.surname = surname
        if (email) user.email = email
        if (phone) user.phone = phone
        if (uRole) user.role = uRole
            
        await user.save()
            
        return res.send(
            {
                success: true,
                message: 'User updated',
                user
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                e
            }
        )
    }
}

export const updateItself = async(req, res)=>{
    try{

        const { uid, status} = req.user

        if(status === false) return res.status(403).send(
            {
                success: false,
                message: 'User is not valid user'
            }
        )

        const { id } = req.params
        let { name, surname, email, phone, } = req.body

        const user = await User.findById(id)
        console.log(uid, id)
        if (uid !== id ){
            return res.status(403).send({message: 'You cant update this user'})
        }

        if(!user || user.status === false) {
            return res.status(400).send(
                {
                    succes: false,
                    message: 'User not found'
                }
            )
        } 

        if (name !== undefined && name.trim() === "") {
            name = user.name
        }
        if (surname !== undefined && surname.trim() === "") {
            surname = user.surname
        }
        if (email !== undefined && email.trim() === "") {
            email = user.email
        }
        if (phone !== undefined && phone.trim() === "") {
            phone = user.phone
        }

        if (name) user.name = name
        if (surname) user.surname = surname
        if (email) user.email = email
        if (phone) user.phone = phone
            
        await user.save()
            
        return res.send(
            {
                success: true,
                message: 'User updated',
                user
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                e
            }
        )
    }
}

export const updatePassword = async(req, res)=>{
    try {

        const { status, uid} = req.user

        if(status === false) return res.status(403).send(
            {
                success: false,
                message: 'User is not valid user'
            }
        )

        let { username, password, newPass } = req.body

        if (!username || !password || !newPass) {
            return res.status(404).send({ message: 'Missing fields' })
        }

        let user = await User.findOne({ username }) 

        if (!user) {
            return res.status(400).send({ message: 'Wrong user or password' })
        }

        if(uid !== user.uid){
            return res.status(403).send({
                success: false,
                message: 'You only can updater your password'
            })
        }

        const isPasswordCorrect = await checkPassword(user.password, password)
        if (!isPasswordCorrect) {
            return res.status(400).send({ message: 'Wrong user or password' })
        }

        user.password = await encrypt(newPass)
        await user.save()

        let loggedUser = {
            uid: user._id,
            username: user.username
        }

        let token = await generateJwt(loggedUser)

        return res.send({
            message: 'Saved new password',
            loggedUser,
            token
        })

    } catch (e) {
        console.error(e)
        return res.status(500).send({message: 'General error with changing passsword function'})
    }
}