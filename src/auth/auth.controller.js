//Logica de autenticacion
import User from '../users/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

//Test
export const test = (req, res)=>{
    console.log('Test is running')
    return res.send({message: 'Test is running'})
}

//Register
export const register = async(req, res)=> {
    try {
        let data = req.body

        let user = new User(data)

        //Encriptar la password
        user.password = await encrypt(user.password)

        //Asignar rol por defecto
        if(!data.role || data.role !== 'ADMIN') user.role = 'CLIENT'

        await user.save()
        
        return res.send({message: `Registered successfully, can be logged with username: ${user.username}`})
        
    } catch (e) {
        console.error(e)
        return res.status(500).send({message: 'General error with registering user', e})
    }
}

export const saveUser = async(req, res)=> {
    try {

        const userRole = req.user

        if (userRole.role !== 'ADMIN' || userRole.status === false){
            return res.status(403).send({message: 'You cant save user'})
        }

        let data = req.body

        let user = new User(data)

        //Encriptar la password
        user.password = await encrypt(user.password)

        await user.save()
        
        return res.send({message: `Registered successfully, can be logged with username: ${user.username}`})
        
    } catch (e) {
        console.error(e)
        return res.status(500).send({message: 'General error with registering user', e})
    }
}

//Login   
export const login = async(req, res)=>{
    try {
        //Capturar los datos body
        let { username, password } = req.body
        //Vaalidar que el usuario exista
        let user = await User.findOne({username}) //findOne({username}) = ({username})
        
        if(user.status === false) return res.status(403).send(
            {
                success: false,
                message: 'Invalid User'
            }
        )

        //Verificar que la contrasena coincida
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }

            let token = await generateJwt(loggedUser)

            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(400).send({message: 'Wrong email or password'})
        //PENDIENTE: generar el token
        //Responder al usuario
    } catch (e) {
        console.error(e)
        return res.status(500).send({message: 'General error with login function'})
    }
}