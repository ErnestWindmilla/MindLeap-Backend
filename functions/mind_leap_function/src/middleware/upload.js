const multer = require('multer');
const path = require('path');
const UPLOAD_DIR = path.join(__dirname, '..', 'files'); // Define la carpeta donde se guardarán los archivos

// Configuración de multer
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_DIR); // Carpeta para los archivos
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para el archivo
        },
    }),
    // limits: {
    //     fileSize: 10000000, // Tamaño máximo del archivo en bytes (10 MB)
    // },
    // fileFilter: (req, file, cb) => {
    //     const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
    //     const mimeType = allowedTypes.test(file.mimetype);
    //     const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    //     if (mimeType && extName) {
    //         return cb(null, true);
    //     }
    //     cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes, PDF y MP4.'));
    // },
});

module.exports = {upload , UPLOAD_DIR};
