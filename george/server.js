var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/gorilla_collection");
var UserSchema = new mongoose.Schema({
	name: String,
	age: Number
});
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//Get all, root  done!
app.get('/', function(req, res) {
	User.find({}, function(err, users) {
	    if(err) {
	      console.log('something went wrong');
	    } else {
	      console.log(users);
	      res.render('index', {"users": users});
	    }
	  })

    //res.render('index', users);
})

//show 1 gorilla done!
app.get('/gorillas/:id',function(req, res){
	User.find({'_id': req.params.id}, function(err, users){
		if(err) {
	      console.log('something went wrong');
	    } else {
	      res.render('show.ejs', {"gorilla": users[0]});
	    }
	});
	
});

//show insert page  done!
app.get('/new', function(req, res){
	res.render('new.ejs');
});

//Insert  done!
app.post('/gorillas', function(req, res) {
    console.log("POST DATA", req.body.name, req.body.age);
    var user = new User({name: req.body.name, age: req.body.age});
	  user.save(function(err) {
	    if(err) {
	      console.log('something went wrong');
	    } else {
	      console.log('successfully added a user!');
	      res.redirect('/');
	    }
	  })
})

//show edit form
app.get('/gorillas/:id/edit',function(req, res) {
	User.find({'_id': req.params.id}, function(err, users){
		if(err) {
	      console.log('something went wrong');
	    } else {
	      res.render('edit.ejs', {"user": users[0]});
	    }
	});
});

//execute edit
app.post('/gorillas/:id',function(req, res){
	console.log("edit");
	User.update({_id: req.params.id},{name: req.body.name, age: req.body.age}, function(err){
		console.log(err);
	});
	res.redirect('/');
});

app.get('/gorillas/:id/destroy', function(req, res){
	console.log("destroy route");
	User.remove({_id: req.params.id}, function(err){
		console.log("Could not delete");
	});
	res.redirect('/');
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})



















