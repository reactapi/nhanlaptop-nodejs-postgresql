
const multer = require('multer')

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const rename = `${Date.now()}-${file.fieldname}-${file.originalname}`
        cb(null, rename)
       
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        return cb({
            message: 'Invalid type'
        }, false);
    }
}


const configMulter = multer({ 
    storage: storage, 
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 }
})

const handleErrorUploadImage = (fieldName) => {

    return (req, res, next) => {

        const uploads = configMulter.single(fieldName)
    
        uploads(req, res, function (error) {
            if (error instanceof multer.MulterError) {
                return res.json({
                    status: 'error',
                    message: error.message
                })
            } else if (error) {
                return res.json({
                    status: 'error',
                    message: error.message || 'File không đúng định dạng!',
                })
            }
            next()
        })
    }

}

module.exports = {
    handleErrorUploadImage
}
