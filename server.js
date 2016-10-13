<<<<<<< HEAD
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
=======

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
>>>>>>> 68491cae855540f3e54f7a1e23cee68c92ed1147
});