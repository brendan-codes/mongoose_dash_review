// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
var connect = mongoose.connect('mongodb://localhost/mongoose_dash');
var PuppySchema = new mongoose.Schema({
	name: String,
    breed: String,
	age: Number
})
mongoose.model('Puppy', PuppySchema); // We are setting this Schema in our Models as 'Puppy'
var Puppy = mongoose.model('Puppy') // We are retrieving this Schema from our Models, named 'Puppy'
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
	Puppy.find({}, function(err, puppies){
		if(err){
    		console.log('something went wrong');
    	} else{
    		res.render('index', {puppy: puppies});
    	}
	});
});
app.get('/puppies/:id', function(req, res) {
    Puppy.findOne({ _id: req.params.id }, function(err, response){
        if (err) {console.log("Something went wrong");}
        res.render('info', {puppy: response});
    });
});
app.get('/new', function(req, res) {
    res.render('newPup');
});
app.post('/puppies', function(req, res) {
    var puppy = new Puppy({name: req.body.name, breed: req.body.breed, age: req.body.age});
    puppy.save(function(err){
        if(err){
            console.log('something went wrong');
        } else{
            console.log('added a puppy!');
            res.redirect('/');
        }
    });
});
app.post('/:id/update', function(req, res) {
    Puppy.update({ _id: req.params.id }, { $set: { name: req.body.name, breed: req.body.breed, age: req.body.age }}, function(err){
        if(err){
            console.log('something went wrong');
        } else{
            res.redirect('/');
        }
    });
});
app.get('/:id/edit', function(req, res) {
    Puppy.findOne({ _id: req.params.id }, function(err, response){
        if(err){ console.log('something went wrong'); }
        res.render('edit', {puppy: response});
    });
});
app.post('/:id/destroy', function(req, res) {
    Puppy.remove({ _id: req.params.id }, function(err){
        if(err){
            console.log('something went wrong');
        } else{
            res.redirect('/')
        }
    });
});
app.get('/back', function(req, res){
    res.redirect('/');
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});