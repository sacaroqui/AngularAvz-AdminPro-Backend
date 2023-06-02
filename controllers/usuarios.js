const Usuario = require('../models/usuario');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcrypt')

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario
        .find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),

        Usuario.count()


    ])




    res.json({
        ok: 'true',
        msg: 'get usuarios',
        usuarios,
        uid: req.uid,
        total
    })

}

const crearUsuarios = async(req, res = response) => {
    // console.log(req.body)
    const { nombre, email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo registrado ya existe'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        //Guardar usuario en DB
        await usuario.save();

        //Generar JWT
        const jwt = await generarJWT(usuario.id);

        res.json({
            ok: 'true',
            msg: 'usuario creado',
            usuario: usuario,
            jwt: jwt
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar log'
        })

    }
}

const actualizarUsuario = async(req, res = response) => {
    // console.log(req.params.id);
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);


        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }



        //actualizaciones
        const { password, google, email, ...campos } = req.body;
        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este email'
            })
        }
        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Los usuarios de google no pueden cambiar su correo'
            })
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true })

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar log'
        })

    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            })
        }
        await Usuario.findByIdAndDelete(uid)
        res.json({
            ok: true,
            msg: 'Usuario eleminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado ... revisar log'
        })

    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}