const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');



const fileUpload = async(req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;


    //Validar tipo
    const tipoValido = ['usuarios', 'medicos', 'hospitales'];
    if (!tipoValido.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo debe ser usuario, medico o hospital '
        })
    }

    //Validar que el archivo exista (Imagen en este caso)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        })
    }

    //Procesar la imagen ...

    const file = req.files.imagen;
    // console.log(file);
    const nombreCortado = file.name.split('.'); //Wolverine.1.3.jpg
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // console.log(extensionArchivo);

    //Validar Extension del archivo
    const extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extension de archivo no valida'
        })
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

    // Path para guardar el archivo
    const pathArch = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(pathArch, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'No se pudo subir la imagen'
            });
        }

        //Actualizar base de Datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: 'true',
            msg: 'Archivo subido',
            nombreArchivo
        })

    });


}

const retornarImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg)
    }



}



module.exports = {
    fileUpload,
    retornarImagen
}