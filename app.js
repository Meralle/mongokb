require('dotenv').config();
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

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
		title:'Add Articles'
	})
})
app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))