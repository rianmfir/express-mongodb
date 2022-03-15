const Product = require('./model');
const fs = require('fs');
const path = require('path');

const index = (req, res) => {
    Product.find()
        .then(result => res.send(result))
        .catch(error => res.send(error));
};

const view = (req, res) => {
    const { id } = req.params;

    Product.findById(id)
        .then(result => {

            if (!result) {
                res.status(404).json({
                    message: "Data Tidak Ditemukan",
                    data: {},
                })
            }

            res.status(200).json({
                message: "Data Ditemukan",
                data: result
            });
        })
        .catch(err => res.send(err));


}

const store = (req, res) => {
    const { name, price, stock, status } = req.body;
    let value = { name, price, stock, status };
    const image = req.file;

    if (image) {
        value = { name, price, stock, status, image_url: `images/${image.filename}` };
    }

    Product.create(value)
        .then(result => {
            res.status(200).json({
                message: "Data Berhasil Ditambahkan",
                data: result,
            })
        })
        .catch(error => res.send(error));
};

const update = (req, res) => {
    const { id } = req.params;
    const image = req.file;
    const { name, price, stock, status } = req.body;
    let value = { name, price, stock, status };

    if (image) {
        value = { name, price, stock, status, image_url: `images/${image.filename}` };
    }

    Product.findById(id)
        .then(result => {

            Product.findByIdAndUpdate(id, value, (err, data) => {
                if (err) {
                    res.json(err);
                } else {
                    if (image) {
                        removeImage(result.image_url);
                    }
                    res.status(200).json({
                        message: "Update Berhasil",
                        data: data
                    })
                }
            })
        })
        .catch(() => {
            res.status(400).json({
                message: `Id ${id} tidak ditemukan`,
            })
        });

};

const destroy = (req, res) => {
    const { id } = req.params;

    Product.findByIdAndDelete(id)
        .then(result => {

            if (!result) {
                res.status(404).json({
                    message: "Data Tidak Ditemukan",
                    data: {},
                })
            }
            removeImage(result.image_url);
            res.status(404).json({
                message: "Data Berhasil Dihapus",
                data: result
            });
        })
        .catch(err => res.send(err));
};

const removeImage = (filePath) => {
    console.log('filePath', filePath);

    filePath = path.join(__dirname, '../../public', filePath);
    fs.unlink(filePath, err => console.log(err));
};

module.exports = {
    index,
    view,
    store,
    update,
    destroy
};