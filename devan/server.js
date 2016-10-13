var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mongoosedashboard');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './static')));

var AnimalSchema = new Schema({
	animal: String,
	name: String,
	age: Number
})

var Animal = mongoose.model('Animal', AnimalSchema);

app.get('/', function(req, res){		
	Animal.find({}, function(err, animals){
		if (err){
			console.log(err);
			console.log('something broke');
			res.send(err);
		} else {
			res.render('index', {animals: animals});
		}
	})
})

// app.get('/mongooses/:id', function(req, res){

// })

app.get('/mongooses/new', function(req, res){
	res.render('new');
})

app.post('/mongooses', function(req, res){
	var animal = new Animal({
		animal: req.body.animal,
		name: req.body.name,
		age: req.body.age
	})
	animal.save(function(err){
		res.redirect('/');
	})
})

app.get('/mongooses/:id/edit', function(req, res){
	Animal.findOne({_id: req.params.id}, function(err, animal){
	animal.save(function(err){
			res.render('edit', {animal: animal});
		});
	});
});

app.post('/mongooses/:id', function(req, res){
	Animal.update({ _id: req.params.id }, req.body, function(err, result){
	res.redirect('/')
})
});
app.post('/mongooses/:id/destroy', function(req, res){
	Animal.remove({_id: req.params.id}, function(err){
	  res.redirect('/')
});
});


app.listen(8000, function() {
    console.log("listening on port 8000");
})
