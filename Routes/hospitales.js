/* 
  Ruta
 /api/hospitales
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getHospitales, crearHospitales, actualizarHospital, borrarHospital } = require('../controllers/hospitales');


const router = Router();


router.get('/', validarJWT, getHospitales)
router.post(
    '/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearHospitales)
router.put(
    '/:id', [], actualizarHospital)

router.delete(
    '/:id', [], borrarHospital)

module.exports = router;