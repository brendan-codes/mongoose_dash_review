
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/giraffes');
var GiraffeSchema = new mongoose.Schema({
	name: String,
	age: Number
}, {timestamps: true});

mongoose.model('Giraffe', GiraffeSchema); 
var Giraffe = mongoose.model('Giraffe'); 



// Routes
// Shows all giraffes
app.get('/', function(req, res) {
	Giraffe.find({}, function(err, giraffes) {
		if(err) {
			console.log('could not find giraffes');
		} else {
			console.log('successfully found giraffes');
			console.log(giraffes);
			var all_giraffes = giraffes;

		}
		res.render('allgiraffes', {all_giraffes: all_giraffes});
	});	
});

// Shows form for creating a new giraffe
app.get('/giraffes/new', function(req,res){
	res.render('newgiraffe');
})

// Creates a new giraffe
app.post('/giraffes', function(req,res){
	console.log('POST DATA', req.body);
	var giraffe = new Giraffe({name: req.body.name, age: req.body.age});
	giraffe.save(function(err){
		if (err){
			console.log("Something went wrong");
		} else {
			console.log("Successfully added giraffe");
			res.redirect('/');
		}
	})
})

// Shows one giraffe
app.get('/giraffes/:id', function(req,res){
	Giraffe.findOne({_id: req.params.id}, function(err, giraffe) {
		if (err){
			console.log("Something went wrong");
		} else {
			console.log(giraffe);
			res.render('onegiraffe', { giraffe: giraffe});
		}	
	})
})

// Allows one giraffe to be edited
app.get('/giraffes/:id/edit', function(req,res){
	Giraffe.findOne({_id: req.params.id}, function(err, giraffe) {
		if (err){
			console.log("Something went wrong");
		} else {
			console.log(giraffe);
			res.render('editgiraffe', {giraffe: giraffe});
		}	
	})
})


// Edits one giraffe's details
app.post('/giraffes/:id', function(req,res){
	Giraffe.update({_id: req.params.id}, {name: req.body.name, age: req.body.age}, function(err) {
		if (err){
			console.log("Something went wrong");
		} else {
			console.log("Successfully updated giraffe");
			res.redirect('/');
		}
	})
})

// Deletes giraffe based on ID
app.post('/giraffes/:id/destroy', function(req,res){
	Giraffe.remove({_id: req.params.id}, function(err){
		if (err){
			console.log("Something went wrong");
		} else {
			console.log("Successfully removed giraffe");
			res.redirect('/');
		}
	})
})

app.listen(8000, function() {
	console.log("Listening on port 8000");
});