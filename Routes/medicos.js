/* 
  Ruta
 /api/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedicos, actualizarMedico, borrarMedico } = require('../controllers/medicos');


const router = Router();


router.get('/', validarJWT, getMedicos)
router.post(
    '/', [
        validarJWT,
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('hospital', 'el Id del hospital es obligatorio y debe ser valido').isMongoId(),
        validarCampos
    ],
    crearMedicos)
router.put(
    '/:id', [
        validarJWT,
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('hospital', 'el Id del hospital es obligatorio y debe ser valido').isMongoId(),
        validarCampos
    ], actualizarMedico)

router.delete(
    '/:id', [
        validarJWT
    ], borrarMedico)

module.exports = router;