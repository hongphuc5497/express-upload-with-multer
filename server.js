// call all the required packages
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const ImageModel = require('./image.model');
const app = express();

// Setup storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now());
	},
});
const uploadStorage = multer({ storage: storage });

// CREATE EXPRESS APP
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES WILL GO HERE
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/uploadFile', uploadStorage.single('myFile'), (req, res, next) => {
	const { file } = req;
	if (!file) {
		const error = new Error('Please upload a file');
		error.httpStatusCode = 400;
		return next(error);
	}
	res.send(file);
});

app.post(
	'/uploadMultiple',
	uploadStorage.array('myFiles', 10),
	(req, res, next) => {
		const { files } = req;
		if (!files) {
			const error = new Error('Please upload a file');
			error.httpStatusCode = 400;
			return next(error);
		}
		res.send(files);
	}
);

app.post(
	'/uploadPhoto',
	uploadStorage.single('myImage'),
	async (req, res, next) => {
		try {
			const img = fs.readFileSync(req.file.path);
			const encoded_img = img.toString('base64');

			const imgRecord = new ImageModel({
				contentType: req.file.mimetype,
				data: Buffer.from(encoded_img, 'base64'),
			});

			const result = await imgRecord.save();
			console.log(result);
		} catch (err) {
			console.error(err);
		} finally {
			console.log('Saved to database');
			res.redirect('/');
		}
	}
);

app.get('/images', async (req, res) => {
	try {
		const userQuery = res.locals.query || {};
		const data = await ImageModel.find(userQuery);

		res.send(data.map((img) => img._id));
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get('/images/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await ImageModel.findById(id);

		res.contentType('image/jpeg');
		res.send(data.data);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.listen(3000, () => console.log('Server started on port 3000'));
