module.exports = function(app){
　app.get('/', function(req,res){
    res.render('main',{
        title: '主页',
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
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

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录!'); 
    return res.redirect('/');
  }
  next();
}