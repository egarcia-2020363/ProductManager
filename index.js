//Ejecutar el pro yecto



    //Desestructurar
    import { initServer } from "./configs/app.js";
    import { config } from "dotenv"; //Decirle a Node que se va a usar DOTENV
    import { connect } from "./configs/mongo.js";
    
    config()
    initServer()
    connect()