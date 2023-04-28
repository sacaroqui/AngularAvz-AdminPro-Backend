const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');

const loginUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });

        //Validacion email
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        //Validacion password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            })
        }

        //Generar TOKEN JWT
        const jwt = await generarJWT(usuarioDB.id);


        res.json({
            ok: 'true',
            jwt: jwt,

        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar log'
        })

    }
}

module.exports = {
    loginUsuario
}