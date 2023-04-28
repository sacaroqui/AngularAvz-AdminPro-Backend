require('dotenv').config(); //Importa la lectura de variables de entorno
const express = require('express'); //importa express
const { dbConection } = require('./database/config'); //Importa la configuracion del DB 
const cors = require('cors');



//Crear el servidor de express
const app = new express();

//Configuracion CORS
app.use(cors());

//Lectura y parceo del body
app.use(express.json())

//Base de datos
dbConection();

//MEAN-USER 
//E3AjzMDKs2GKv3XS

//Rutas
app.use('/api/usuarios', require('./Routes/usuarios'));
app.use('/api/login', require('./Routes/auth'));


app.listen(process.env.PORT, () => {
    console.log('Server corriendo en el puerto ' + process.env.PORT);
})