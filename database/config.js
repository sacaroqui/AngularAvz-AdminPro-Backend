const mongoose = require('mongoose');


const dbConection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('No se conecto a la base de datos')

    }

}

module.exports = {
    dbConection
}