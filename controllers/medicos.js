const Medico = require('../models/medico');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcrypt');
const hospital = require('../models/hospital');

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
    const idMedico = req.params.id;
    const idHospital = req.body.hospital;
    const uid = req.uid;


    try {
        const medicoDB = await Medico.findById(idMedico);
        const hospitalDB = await hospital.findById(idHospital);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese ID'
            })
        }

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese ID'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(idMedico, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medico: medicoActualizado

        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado ... Consulte los logs'
        })

    }

    res.json({
        ok: true,
        msg: 'actualizarMedico'

    })

}

const borrarMedico = async(req, res = response) => {
    const idMedico = req.params.id;
    try {
        const medicoDB = await Medico.findById(idMedico);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese ID'
            })
        }
        await Medico.findByIdAndDelete(idMedico);
        res.json({
            ok: true,
            msg: 'Medico Borrado',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado ... Consulte los logs'
        })
    }

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