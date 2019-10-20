const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const port = 3000;
const path = require('path');

const sqlite3 = require('sqlite3');
const dbpath = './blog.db';

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.listen(port, () => console.log('Listening on port ' + port));
makeTable();

app.get('/', (req, res) => {
	getPosts((rows) => {

		res.render('index',{posts: rows});
	});
	
});

app.post('/newpost/', (req, res) => {
	newPost(req.body.author, req.body.title, req.body.blog_post);
	res.redirect('/');
});

app.get('/posts/:postId(\\d+)', (req, res) => {
	getPost(req.params.postId, (row) => {
		res.render('post', {post: row});
	});
});

app.get('/posts/:author', (req, res) => {
	getAuthorPosts(req.params.author, (rows) => {
		res.render('author-posts', {posts: rows, author:req.params.author});
	});
});

function makeTable() {
	let db = new sqlite3.Database(dbpath);
	const sql = `CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			author TEXT,
			title TEXT,
			body TEXT
		)`;
	db.run(sql);
	db.close();

}

function newPost(author, title, body) {
	let db = new sqlite3.Database(dbpath);
	const sql = `INSERT INTO posts (author,title,body) VALUES(?,?,?)`;
	db.run(sql, [author, title, body], function(err) {
		if (err) {
			return console.log(err.message);
		}
	});
	db.close();
}

function getPost(id, callback) {
	let db = new sqlite3.Database(dbpath);
	const sql = `SELECT * FROM posts WHERE id=?`;
	db.get(sql, [id], (err, row) => {
		if (err) {
			return console.log(err.message);
		} 
		callback(row);
		db.close()
		
	});

}

function getPosts(callback) {
	let db = new sqlite3.Database(dbpath);
	const sql = `SELECT * FROM posts`;
	db.all(sql, [], (err, rows) => {
		if (err) {
			return console.log(err.message);
		} 
		callback(rows);
		db.close()
		
	});

}

function getAuthorPosts(author, callback) {
	let db = new sqlite3.Database(dbpath);
	const sql = `SELECT * FROM posts WHERE author=?`;
	db.all(sql, [author], (err, rows) => {
		if (err) {
			return console.log(err.message);
		} 
		callback(rows);
		db.close()
		
	});

}
