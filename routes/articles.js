var express = require('express');
var router = express.Router();

//Bring in Article Module
let Article = require('../models/article');


//Add route
router.get('/add', (req, res) => {
	res.render('add_article', {
		title:'Add Article'
	});
});

//Add Submit Post Route
router.post('/add', (req, res) => {
	// console.log('Submitted');
	// return;
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('author', 'Author is required').notEmpty();
	req.checkBody('body', 'body is required').notEmpty();

	//Get Errors
	let errors = req.validationErrors();
	if(errors){
		res.render('add_article', {
			title:'Add Article',
			errors:errors
		});

	} else {
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
				req.flash('success','Article Added');
				res.redirect('/');
			}
		});

	}

});

//load Edit form
router.get('/edit/:id', (req,res) => {
	Article.findById(req.params.id,(err, article) => {
		res.render('edit_article', {
		title: 'Edit Article',
		article:article
		});
	});
});


//update Submit Post Route
router.post('/edit/:id', (req, res) => {
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id:req.params.id}
	
	Article.update(query, article, (err) => {
		if(err){
			console.log(err);
			return;
		} else {
			req.flash('success', 'Article Updated')
			res.redirect('/');
		}
	});
});

//Delete Article
router.delete('/:id', (req, res) => {
	let query = {_id:req.params.id}
	Article.remove(query, (err) => {
		if(err){
			console.log(err);
		}
		res.send('Success');
	});
});

//get single article
router.get('/:id', (req,res) => {
	Article.findById(req.params.id,(err, article) => {
		res.render('article', {
		article:article
		});
	});
});

module.exports = router;