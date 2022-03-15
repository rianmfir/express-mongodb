require('./config/mongoose');

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;

const productNativeRouter = require('./app/product-native/routes');
const productRouter = require('./app/product/routes');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public/images')));

app.use('/api/v1', productNativeRouter);
app.use('/api/v2', productRouter);

app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: 'failed',
        message: 'Resource ' + req.originalUrl + ' not found'
    });
});


// app.listen(process.env.PORT || port, () => console.log('Server : Running Success'));
app.listen(process.env.PORT || port, () => console.log(`Server : http://localhost:${port}`));