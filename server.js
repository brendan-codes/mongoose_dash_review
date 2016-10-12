var express = require("express");
var path = require("path");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/mongoose_dashboard');

var PandaSchema = new mongoose.Schema({
 name: String,
 age: Number
})
mongoose.model('Panda', PandaSchema); 
var Panda = mongoose.model('Panda') 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//
//      GET ROUTES
//

app.get('/', function(req, res) {
    Panda.find({}, function(err, pandas) {
    if(err) {
      console.log('something went wrong');
    } else { 
      console.log('successfully got all pandas!');
      res.render("index",{pandas: pandas});
    }
  })
})

app.get('/pandas/new', function(req, res) {
  res.render("new");
})

app.get('/pandas/:id', function(req, res) {
  var id = req.params.id
  Panda.find({_id:id}, function(err, pandas) {
    if(err) {
      console.log('something went wrong');
    } else { 
      console.log('successfully got the panda!');
      res.render("panda",{pandas: pandas});
    }
  })
})

app.get('/pandas/:id/edit', function(req, res) {
  var id = req.params.id
  Panda.find({_id:id}, function(err, pandas) {
    if(err) {
      console.log('something went wrong');
    } else { 
      console.log('successfully got the panda!');
      res.render("editpanda",{pandas: pandas});
    }
  })
})

//
//      POST ROUTES
//

app.post('/pandas', function(req, res) {
  console.log("POST DATA", req.body);
  var panda = new Panda({name: req.body.name, age: req.body.age});
  panda.save(function(err) {
    if(err) {
      console.log('something went wrong');
    } else {
      console.log('successfully added a panda!');
      res.redirect('/');
    }
  })
})

app.post('/pandas/:id', function(req, res) {
  var id = req.params.id
  Panda.find({_id:id}, function(err, pandas) {
    if(err) {
      console.log('something went wrong');
    } else { 
      // update
      Panda.update({_id:id},{name: req.body.name, age: req.body.age}, function(err){
        console.log('something went wrong');
      });
      res.redirect("/");
    }
  });
})

app.post('/pandas/:id/destroy', function(req, res) {
  var id = req.params.id
  Panda.remove({_id:id}, function(err) {
    if(err) {
      console.log('something went wrong');
    } else{
      res.redirect("/");
    }
  });
})

app.listen(8000, function() {
 console.log("listening on port 8000");
});
