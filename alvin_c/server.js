var express = require('express');
var app = express();
//
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

// import and use mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_meese');
var MeeseSchema = new mongoose.Schema({
 name: String,
 age: Number
})
mongoose.model('Meese', MeeseSchema); // We are setting this Schema in our Models as 'meese'
var Meese = mongoose.model('Meese') // We are retrieving this Schema from our Models, named 'meese'
mongoose.Promise = global.Promise; // because reasons

// Routes //
// display all of the meese
app.get('/', function(req, res) {
  Meese.find({}, function(err, meese){
    if(!err){
      //console.log(meese);
      res.render('index',{meese:meese});
    }
    else {
      console.log('database find error occured');
      res.send('error!');
    }
  })
})
// displays information about one meese
app.get('/meese/new', function(req, res){
  res.render('form');
})
// displays a form for making a new meese
app.get('/meese/:id', function(req, res){
  console.log(req.params.id);
  Meese.find({_id:req.params.id}, function(err, meese){
    if(!err){
      //console.log(meese);
      res.render('profile',{meese:meese});
    }
    else {
      console.log('database find error occured');
      res.send('error!');
    }
  })
})
// should show a form to edit an existing meese
app.get('/meese/:id/edit', function(req, res){
  console.log('edit path called'+req.params.id)
  Meese.find({_id:req.params.id}, function(err, meese){
    if(!err){
      //console.log(meese);
      res.render('form1',{meese:meese});
    }
    else {
      console.log('database find error occured');
      res.send('error!');
    }
  })
})

// should be the action attribute for the form in (GET '/meese/new')
app.post('/meese', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new meese with the name and age corresponding to those from req.body
  var moose = new Meese({name: req.body.name, age: req.body.age});
  // Try to save that new meese to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  moose.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
      res.send('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      //console.log('successfully added a meese!');
      res.redirect('/');
    }
  })
})
// should be the action attribute for the form in the above route (GET '/meese/:id/edit')
app.post('/meese/:id/', function(req, res){
  console.log(req.body);
  Meese.update({_id:req.params.id},{$set:{name:req.body.name, age:req.body.age}},function(err){
    console.log('updated some user');
    res.redirect('/');
  });
  //res.redirect('/');
})
// should delete the meese from the database by ID
app.post('/meese/:id/destroy', function(req, res){
  Meese.remove({_id:req.params.id}, function(err){
    console.log('deleted '+req.params.id);
    res.redirect('/');
  })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
