var mongoose = require('mongoose');
// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose_db');
  var MongooseSchema = new mongoose.Schema({
   name: String,
   info: String,
   comment: String
  }, { versionKey: false });
  mongoose.model('Mongoose', MongooseSchema); // We are setting this Schema in our Models as 'User'
  var Mongoose = mongoose.model('Mongoose') // We are retrieving this Schema from our Models, named 'User'
// Routes
// Root Request
// app.get('/', function(req, res) {
//     // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
//     res.render('index');
// })
// ADD NEW MONGOOSES
app.post('/mongooses', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var mongoose = new Mongoose({name: req.body.name, info: req.body.info});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  mongoose.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/');
    }
  })
})
//SHOW ALL MONGOOSES
app.get('/', (req, res) => {
  db.collection('mongooses').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    console.log(result);
    res.render('index.ejs', {mongooses: result})
  })
})
// DESTROY THE MONGOOSE
app.post('/:id/delete', function(req, res){
  Mongoose.remove({ _id: req.params.id }, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  });
});
//EDIT
app.get('/:id/edit/', function(req, res){
  Mongoose.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('edit', { mongoose: response[0] });
  })
});
// UPDATE
app.post('/:id', function(req, res){
  Mongoose.update({ _id: req.params.id }, req.body, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  });
});
// VIEW
app.get('/:id/view/', function(req, res){
  Mongoose.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('view', { mongoose: response[0] });
  });
});
// NEW
app.get('/new', function(req, res){
  res.render('new');
});
// Setting our Server to Listen on Port: 8001
app.listen(8001, function() {
    console.log("listening on port 8001");
})
