const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/express-multer', { useNewUrlParser: true });

let imageSchema = new mongoose.Schema({
	contentType: String,
	data: Buffer,
});

module.exports = mongoose.model('Image', imageSchema);
