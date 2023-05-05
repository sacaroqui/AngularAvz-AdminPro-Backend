const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');


const getBusquedas = async(req, res = response) => {
    const termino = req.params.termino;
    const regex = RegExp(termino, 'i');


    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
    ])

    res.json({
        ok: 'true',
        usuarios,
        hospitales,
        medicos
    })

}

const getBusquedasColeccion = async(req, res = response) => {
    const termino = req.params.termino;
    const tabla = req.params.tabla;
    const regex = RegExp(termino, 'i');

    let respuesta = [];
    switch (tabla) {
        case 'usuarios':
            respuesta = await Usuario.find({ nombre: regex });
            break;
        case 'medicos':
            respuesta = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img')
            break;
        case 'hospitales':
            respuesta = await Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre img')
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La coleccion tabla de busqueda debe ser usuarios/medicos/hospitales'
            });

    }


    res.json({
        ok: 'true',
        respuesta
    })

}



module.exports = {
    getBusquedas,
    getBusquedasColeccion

}