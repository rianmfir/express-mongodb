const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const crypto = require("crypto");
const productController = require('./controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const random = crypto.randomBytes(10).toString('hex');
        cb(null, random + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('image');

router.get('/product', productController.index);
router.get('/product/:id', productController.view);
router.post('/product', upload, productController.store);
router.put('/product/:id', upload, productController.update);
router.delete('/product/:id', upload, productController.destroy);

module.exports = router;