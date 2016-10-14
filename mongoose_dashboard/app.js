var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo_dashboard');

var MongooseSchema = new mongoose.Schema({
	name: {type: String}
}, {timestamps: true});

mongoose.model('Mongoose', MongooseSchema);

var Mongoose = mongoose.model('Mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, "./views"));
app.set('view engine', 'ejs');

app.get('/', function(request, response){
	Mongoose.find({}, function(err, mongooses){
		if (err){
			console.log('Errors');
		} else {
			response.render('index', {mongooses: mongooses})
		}
	})
})

app.get('/mongooses/new', function(request, response){
	response.render('new');
})

app.get('/mongooses/:id', function(request, response){
	Mongoose.find({_id: request.params.id}, function(err, mongooses){
		if (err){
			console.log("errors");
		} else {
			response.render('one', {mongooses: mongooses});
		}
	})
})

app.post('/mongooses', function(request, response){
	var mongoose = new Mongoose({name: request.body.name});
	mongoose.save(function(err){
		if (err){
			console.log("Something went wrong")
		} else {
			response.redirect('/');
		}
	})
})

app.get('/mongooses/:id/edit', function(request, response){
	Mongoose.find({_id: request.params.id}, function(err, mongooses){
		if (err){
			console.log("errors");
		} else {
			response.render('edit', {mongooses: mongooses});
		}
	})
})

app.post('/mongooses/:id', function(request, response){
	Mongoose.update({_id: request.params.id}, {name: request.body.name}, function(err){
		if (err){
			console.log("err");
		} else {
			response.redirect('/mongooses/' + request.params.id);
		}
	});
})

app.post('/mongooses/:id/destroy', function(request, response){
	Mongoose.remove({_id: request.params.id}, function(err){
		if (err){
			console.log("err");
		} else {
			response.redirect('/');
		}
	})
})

app.listen(3000, function(){
	console.log("mongoose dashboard listening on port 3000");
})