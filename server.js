// call all the required packages
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage: storage })

// CREATE EXPRESS APP
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES WILL GO HERE
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.listen(3000, () => console.log('Server started on port 3000'));
