const Hospital = require('../models/hospital');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcrypt');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre email img');

    res.json({
        ok: 'true',
        hospitales: hospitales
    })




}

const crearHospitales = async(req, res = response) => {
    const uid = req.uid;
    console.log(uid);
    const hospital = new Hospital({ usuario: uid, ...req.body });


    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: 'true',
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... Revisar Logs'
        })

    }


}

const actualizarHospital = async(req, res = response) => {
    // console.log(req.params.id);


    res.json({
        ok: true,
        msg: 'actualizarHospital'

    })

}

const borrarHospital = async(req, res = response) => {


    res.json({
        ok: true,
        msg: 'Hospital eleminado'
    })


}

module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospital,
    borrarHospital
}