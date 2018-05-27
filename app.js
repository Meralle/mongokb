var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var pug = require('pug');
require('dotenv').config();



//Connect with mongodb
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', () => {
	console.log('connected to MongoDB');
});

//check for db errors
db.on('error', (err) => {
	console.log(err);
});

//init app
var app = express();

//Bring in Modules
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');



//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//home router
app.get('/', (req, res) => {
	// let articles = [
	// 	{
	// 		id:1,
	// 		title:'Article one',
	// 		author:'meralle',
	// 		body:'this is article one'
	// 	},
	// 	{
	// 		id:2,
	// 		title:'Article Two',
	// 		author:'Marta',
	// 		body:'this is article two'
	// 	},
	// 	{
	// 		id:3,
	// 		title:'Article Three',
	// 		author:'Tommy',
	// 		body:'this is article three'
	// 	},
	// ]
	Article.find({}, (err, articles) => {
		if(err){
			console.log(err);
		} else {
		res.render('index', {
			title:'Articles',
			articles:articles
		});

		}
	});
	
});

//Add route
app.get('/articles/add', (req, res) => {
	res.render('add_article', {
		title:'Add Article'
	});
});

//Add Submit Post Route
app.post('/articles/add', (req, res) => {
	// console.log('Submitted');
	// return;
	 let article = new Article();
	 article.title = req.body.title;
	 article.author = req.body.author;
	 article.body = req.body.body;
	// console.log(req.body.title);
	// return 
	article.save(err => {
		if(err){
			console.log(err);
			return;
		}else {
			res.redirect('/');
		}
	});
});
app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))