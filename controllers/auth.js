const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const loginGoogle = async(req, res = response) => {

    try {
        const { email, name, picture } = await googleVerify(req.body.token);

        //Validacion si existe el usuario en DB
        const usuarioDB = await Usuario.findOne({ email });
        let usuarioGoogle;
        if (!usuarioDB) {
            usuarioGoogle = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuarioGoogle = usuarioDB;
            usuarioGoogle.google = true;
        }

        //Guardar el nuevo usuario
        await usuarioGoogle.save();

        //Generar Token JWT
        const jwt = await generarJWT(usuarioGoogle.id);


        res.json({
            ok: true,
            email,
            name,
            picture,
            jwt
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'token de google no valido'
        })
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;

    //Generar TOKEN JWT
    const jwt = await generarJWT(uid);

    res.json({
        ok: 'true',
        jwt
    })

}

module.exports = {
    loginUsuario,
    loginGoogle,
    renewToken
}