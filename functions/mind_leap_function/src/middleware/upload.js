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
});
//Intento se dubir varios archivo en mullter
// const mullti_upload = multer({ storage,
//     limits: { fileSize: 1024 * 1024 }, //1MB
//     fileFilter: (reqmfile, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false); 
//             const err = new Error('Only .png, .jpg and .jpeg format allowed!');
//             err.name
//             return cb(err)
//             // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         }}.array('uploadImnages', 2) })

module.exports = {upload , UPLOAD_DIR};
