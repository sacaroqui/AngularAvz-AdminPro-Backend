/* 
  Ruta
 /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { loginUsuario, loginGoogle } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post(
    '/', [
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    loginUsuario);

router.post(
    '/google', [
        check('token', 'El token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    loginGoogle);

module.exports = router;