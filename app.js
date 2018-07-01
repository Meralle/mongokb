var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var pug = require('pug');
require('dotenv').config();
var nodeMailer = require('nodemailer');



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


//set public folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = 3000;


//contact send email part
app.get('/contact', (req,res) => {
	res.render('contact')
});

app.post('/send', (req, rea) => {
	let transporter = nodeMailer.createTransport({
		host: 'smtp.gmail.com',
		post: 560,
		secure: false,
		auth: {
			user:process.env.MAILER_MAIL,
			pass: process.env.MAILER_PW
		}
	});

	let mailOptions = {
		from: '"meralle" <mar.ha17@outlook.com>',
		name:req.body.name,
		to: req.body.email,
		subject:req.body.subject,
		text:req.body.message
	};

	transporter.sendMail(mailOptions, (error, info) =>{
		if (error) {
			return console.log(error);
		}
		console.log('Message %s sent: %s , info.messageId, info.response');
		res.render('index');
	});
});

		

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

//get single article
app.get('/article/:id', (req,res) => {
	Article.findById(req.params.id,(err, article) => {
		res.render('article', {
		article:article
		});
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

//load Edit form
app.get('/article/edit/:id', (req,res) => {
	Article.findById(req.params.id,(err, article) => {
		res.render('edit_article', {
		title: 'Edit Article',
		article:article
		});
	});
});


//update Submit Post Route
app.post('/articles/edit/:id', (req, res) => {
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id:req.params.id}
	
	Article.update(query, article, (err) => {
		if(err){
			console.log(err);
			return;
		}else {
			res.redirect('/');
		}
	});
});

app.delete('/article/:id', (req, res) => {
	let query = {_id:req.params.id}
	Article.remove(query, (err) => {
		if(err){
			console.log(err);
		}
		res.send('Success');
	});
});
app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))