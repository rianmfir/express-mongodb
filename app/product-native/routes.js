const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const crypto = require("crypto");
const productNativeController = require('./controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const random = crypto.randomBytes(10).toString('hex');
        cb(null, random + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/product', productNativeController.index);
router.get('/product/:id', productNativeController.view);
router.post('/product', upload.single('image_url'), productNativeController.store);
router.put('/product/:id', upload.single('image_url'), productNativeController.update);
router.delete('/product/:id', upload.single('image_url'), productNativeController.destroy);

module.exports = router;