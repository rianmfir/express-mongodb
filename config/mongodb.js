const { MongoClient } = require('mongodb');

// Conneection URL
const url = 'mongodb://eduwork:asdasdasd@localhost:27017?authSource=admin';
const client = new MongoClient(url);

(async () => {

    try {
        await client.connect();
        console.log('Koneksi ke MongoDB berhasil');
    } catch (error) {
        console.log(error);
    }
})();

const db = client.db('eduwork-native');

module.exports = db;