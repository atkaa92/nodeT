var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users'])
var app = express();

/*
//Custom Middleware
var logger = function(req, res, next){
    console.log('Logging...');
    next();
};
app.use(logger);*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

//Global Variables
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
})
//Express Validator Middleware
app.use(expressValidator());

// var users = [
//     {
//         name: 'Jeff',
//         email: 'jeff@gmail.com',
//         age:26,
//         id:1,
//     },
//     {
//         name: 'Jack',
//         id:2,
//         email: 'jack@gmail.com',
//         age:30,
//     },
//     {
//         name: 'John',
//         id:3,
//         email: 'john@gmail.com',
//         age:11,
//     }
// ]
// ;
var title = 'Customers';

app.get('/', function(req,res){
    // res.send('Hello World!!!');
    // res.json(person)
    db.users.find(function (err, docs) {
        console.log(docs);
        res.render('index', {
            title : title,
            // users : users,
            users : docs
        })
    })
});

app.post('/users/add', function(req,res){
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('index', {
            title : title,
            users : users,
            errors : errors,
        })
    }else{
        var newUser = {
            name: req.body.name,
            email: req.body.email,
        }
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.redirect('/')
            }
        })
    }
    
    
});

app.listen(3000, function(){
    console.log('Server started on Port 3000...');
    
})