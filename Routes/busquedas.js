/* 
  Ruta
 /api/todo/
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getBusquedas, getBusquedasColeccion } = require('../controllers/busquedas');


const router = Router();


router.get('/:termino', validarJWT, getBusquedas);
router.get('/coleccion/:tabla/:termino', validarJWT, getBusquedasColeccion);


module.exports = router;