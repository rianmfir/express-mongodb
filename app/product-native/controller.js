const fs = require('fs');
const path = require('path');
const { ObjectId } = require('bson');
const db = require('../../config/mongodb');
const Product = require('../product/model');
const res = require('express/lib/response');

const index = (req, res) => {
    db.collection('products').find()
        .toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error));
};

const view = (req, res) => {
    const { id } = req.params;

    db.collection('products').find({ _id: ObjectId(id) })
        .toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error));
};

const store = (req, res) => {
    const { name, price, stock, status } = req.body;
    const image = req.file;
    let value = { name, price, stock, status };

    if (image) {
        value = { name, price, stock, status, image_url: `images/${image.filename}` };
    }


    db.collection('products').insertOne(value)
        .then(result => res.send(result))
        .catch(error => res.send(error));
};

const update = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, status } = req.body;
    const image = req.file;
    let value = { name, price, stock, status };

    const data = await db.collection('products').findOne({ _id: ObjectId(id) });

    if (image) {
        value = { name, price, stock, status, image_url: `images/${image.filename}` };

        removeImage(data.image_url);
    }


    await db.collection('products').updateOne({ _id: ObjectId(id) }, { $set: value })
        .then(result => res.send(result))
        .catch(error => res.send(error));

};

const destroy = async (req, res) => {
    const { id } = req.params;
    await db.collection('products').findOne({ _id: ObjectId(id) })
        .then(result => {

            if (!result) {
                res.status(404).json({
                    message: "Data Tidak Ditemukan",
                    data: {},
                })
            }
            removeImage(result.image_url);
            res.status(200).json({
                message: "Data Berhasil Dihapus",
                data: result,
            })
            db.collection('products').findOneAndDelete({ _id: ObjectId(id) });
        })
        .catch(error => res.send(error));
};

const removeImage = (filePath) => {
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