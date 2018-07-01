var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var pug = require('pug');
require('dotenv').config();
var nodeMailer = require('nodemailer');
var expressValidator = require('express-validator');
var flash = require ('connect-flash');
var session = require('express-session');



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


//Express Section Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		var namespace = param.split('.')
		, root  = namespace.shift()
		, formParam = root;


	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}

	return {
		param :formParam,
		msg : msg,
		value : value

		};
	}
}));

//contact send email part
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = 3000;

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

//Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);

//start server
app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))