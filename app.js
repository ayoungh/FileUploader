var express = require('express');
var hbs = require('hbs');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');

var app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

console.log(path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//var router = express.Router();

//middleware to enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name");
  next();
});

app.get('/', function(req, res, next) {

    var uploadFolder = './public/uploads';
    //console.log('uploadFolder: ', uploadFolder);
    //get the list of files
    fs.readdir(uploadFolder, function (err, files) {
      console.log('files: ', files);
      res.render('index', { title: 'File Uploader', rows: files });
    });



});

app.get('/filelist', function(req, res, next) {

  var uploadFolder = './public/uploads';
  //console.log('uploadFolder: ', uploadFolder);
  //get the list of files
  fs.readdir(uploadFolder, function (err, files) {
    console.log('dir files: ', files);

    for (var i = 0; i < files.length; i++) {
      var filepath = path.join(__dirname + uploadFolder + '\\'+files[i]);
      console.log(filepath);
      fs.stat(filepath, function(err, stats) {
        console.log(stats);
      });
    }

    //console.log('dir err: ', err);
    res.json({ files: files });
  });

});

app.post('/fileupload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  //form.uploadDir = path.join(__dirname, '/public/uploads');
  form.uploadDir = './public/uploads';
  form.hash = false;
  //console.log(form);

  form.on('file', function(field, file) {
    //rename the incoming file to the file's name
    fs.rename(file.path, form.uploadDir + "/" + file.name);
  });


    form.on('error', function(err) {
      throw err;
    });
    form.on('field', function(field, value) {
      //receive form fields here
    });
    /* this is where the renaming happens */
    form.on ('fileBegin', function(name, file){
      //rename the incoming file to the file's name
      //file.path = form.uploadDir + "/" + file.name;
      //fs.rename(file.path, form.uploadDir + "/" + file.name);
    });

    form.on('file', function(field, file) {
      //On file received
    });

    // form.on('progress', function(bytesReceived, bytesExpected) {
    //   //self.emit('progess', bytesReceived, bytesExpected)
    //
    //   var percent = (bytesReceived / bytesExpected * 100) | 0;
    //   process.stdout.write('Uploading: %' + percent + '\r');
    // });

    form.on('end', function() {


    });

    form.parse(req);

});



app.listen(3002, function () {
  console.log('Example file upload app listening on port 3002!');
});
