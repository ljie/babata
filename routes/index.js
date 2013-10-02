var Post = require('../models/post.js');

module.exports = function(app){
　app.get('/', function(req,res){
	console.log("========================/");
    Post.getArticle(function(err, posts){
      if(err){
        posts = [];
      } 
      res.render('main',{
        title: '主页',
        posts: posts
      });
    });
  });
  app.get('/findArticle', function(req,res){
	console.log("========================/findArticle");
	var titleSearch = req.query.title;
    Post.findArticle(titleSearch,function(err, posts){
      if(err){
        posts = [];
      } 
      res.render('search_result',{
        title: '主页',
        posts: posts
      });
    });
  });
  app.get('/findDetail', function(req,res){
	console.log("========================findDetail");
	var id = req.query.id;
    Post.findDetail(id,function(err, posts){
      if(err){
        posts = [];
      } 
	  console.log(posts+"======================");
      res.render('detail',{
        title: '主页',
        posts: posts
      });
    });
  });
  
  app.post('/saveSuggest', function(req,res){
  
	console.log("=11111111111111111111111111111111111111111111111111111111=======================saveSuggest");
	var articleId = req.body.articleId;
	var name = req.body.name;
	var email = req.body.email;
	var content = req.body.content;
	console.log(articleId+"=="+name+"=11111111111111111111111111111111111111111111111111111111=======================saveSuggest");
    Post.saveSuggest(articleId,name,email,content,function(err, posts){
      if(err){
        posts = "error";
      } 
      res.end(posts);
    });
  });
  
  app.get('/getSuggestByArticleId', function(req,res){
	console.log("========================findDetail");
	var id = req.query.articleId;
    Post.getSuggestByArticleId(id,function(err, posts){
      if(err){
        posts = [];
      } 
      res.render('suggestContent',{
        posts: posts
      });
    });
  });
  
  
  app.all('*', function(req,res){
    res.render("404");
  });
 
};

function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error','未登录!'); 
    return res.redirect('/login');
  }
  next();
}


