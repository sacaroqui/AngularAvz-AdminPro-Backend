const Medico = require('../models/medico');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcrypt');

const getMedicos = async(req, res = response) => {
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')

    res.json({
        ok: 'true',
        medicos: medicos
    })

}

const crearMedicos = async(req, res = response) => {
    const uid = req.uid
    const medico = new Medico({ usuario: uid, ...req.body });

    try {
        const medicoDB = await medico.save();

        res.json({
            ok: 'true',
            medico: medicoDB,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado ... Consulte los logs'
        })

    }



}

const actualizarMedico = async(req, res = response) => {
    // console.log(req.params.id);


    res.json({
        ok: true,
        msg: 'actualizarMedico'

    })

}

const borrarMedico = async(req, res = response) => {


    res.json({
        ok: true,
        msg: 'Medico eleminado'
    })


}

module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedico,
    borrarMedico
}