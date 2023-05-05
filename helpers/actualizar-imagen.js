const fs = require('fs');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const actualizarImagen = async(tipo, id, nombreArchivo) => {
    const borrarImagen = (path) => {
        if (fs.existsSync(path)) {
            //borrar la imagen anterior
            fs.unlinkSync(path);
        }
    }

    let pathViejo = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No existe un medico con ese id');
                return false
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo)
            medico.img = nombreArchivo;
            await medico.save();
            return true
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No existe un hospital con ese id');
                return false
            }

            pathViejo = `./uploads/medicos/${hospital.img}`;
            borrarImagen(pathViejo)
            hospital.img = nombreArchivo;
            await hospital.save();
            return true

            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No existe un usuario con ese id');
                return false
            }

            pathViejo = `./uploads/medicos/${usuario.img}`;
            borrarImagen(pathViejo)
            usuario.img = nombreArchivo;
            await usuario.save();
            return true
            break;


    }

}

module.exports = {
    actualizarImagen
}