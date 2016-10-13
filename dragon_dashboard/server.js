var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

// connect this to the db
mongoose.connect('mongodb://localhost/dragon_dashboard')

//create Schema

var DragonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  color: String
})

mongoose.model('Dragon', DragonSchema);
var Dragon = mongoose.model('Dragon')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res){
  Dragon.find({}, function(err, dragons){
    console.log(dragons);
    if (err){
      console.log("something broke");
    }
    else{
      console.log("yay dragons");
      res.render('index', {"dragons": dragons});
    }
  })
})
app.post('/', function(req, res){
  var dragon = new Dragon ({name: req.body.name, age: req.body.age, color: req.body.color});
  dragon.save(function(err){
    if(err){
      console.log("couldn't add Dragon");
    }else{
      console.log("Dragon Added");
      res.redirect('/');
    }
  })
})

app.get('/new', function(req, res){
  res.render('new')
})

app.get('/:id/edit', function(req, res){
  Dragon.find({ _id: req.params.id }, function(err, dragon){
    if (err){
      console.log("edit dragon broke");
    }else{
      console.log("edit this dragon");
      res.render('edit', {"dragon": dragon});
    }
  })
})

app.post('/update/:id', function(req, res){
  Dragon.update({_id: req.params.id}, req.body, function(err, dragon){
    if (err){
      console.log('cant update');
    }
    else{
      console.log("Dragon updated!");
      res.redirect('/');
    }
  })
})

app.post('/:id/delete', function(req, res){
  Dragon.remove({ _id: req.params.id }, function(err){
    res.redirect('/');
  });
});

app.listen(8000, function(){
  console.log("on 8000");
})
