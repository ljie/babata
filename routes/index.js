var db_options={
	host:'localhost',
	port : 3306,
	user : 'root', 
	password : 'root', 
	database:'babata'
	}
var mqDriver = require("mysql");
var mysql = mqDriver.createConnection(db_options);
mysql.connect();
handleDisconnect(mysql);


module.exports = function(app){
　app.get('/', function(req,res){
    var sql = "select a.*,(SELECT count(*) from liuyan l WHERE l.artical_id=a.id) as liuyanCount,t.`name` as type "+
			  "from article a  LEFT OUTER JOIN type t ON t.id=a.type where tuijian = 1";
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				console.log(err+"======================================");
			} else{
			//id,content,type,time,title,biaoqian,tuijian
				rs.forEach(function(doc){
				console.log(doc+"======================================");
					var post=new Posts(doc.id,doc.content,doc.type,doc.time,doc.title,doc.biaoqian,doc.tuijian,doc.liuyanCount)
					array.push(post);
					
				});
				res.render('main',{
					title: '主页',
					posts: array	
				});	
			
			}
	});
		
  });
  app.get('/findArticle', function(req,res){
	var titleSearch = req.query.title;
    var sql = "select a.*,(SELECT count(*) from liuyan l WHERE l.artical_id=a.id) as liuyanCount,t.`name` as type "+
			  "from article a  LEFT OUTER JOIN type t ON t.id=a.type where tuijian = 1 AND a.title like " + "'%"+titleSearch+"%'";
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				console.log(err+"======================================");
			} else{
			//id,content,type,time,title,biaoqian,tuijian
				rs.forEach(function(doc){
				console.log(doc+"======================================");
					var post=new Posts(doc.id,doc.content,doc.type,doc.time,doc.title,doc.biaoqian,doc.tuijian,doc.liuyanCount)
					array.push(post);
					
				});
				res.render('search_result',{
					title: '',
					posts: array	
				});	
			}
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

function handleDisconnect(mysql) {
  mysql.on('error', function(err) {
    if (!err.fatal) {
	  mysql.end();
      return;
    }   

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      mysql.end();
	  throw err;
    }   

    console.log('Re-connecting lost mysql: ' + err.stack);
	mysql = mqDriver.createConnection(db_options);
    handleDisconnect(mysql);
	mysql.connect();
  }); 
} 

function Posts(id,content,type,time,title,biaoqian,tuijian,liuyanCount){
    this.id = id;
    this.content = content;
    this.type = type
    this.time = time;
    this.title = title;
    this.biaoqian = biaoqian;
    this.tuijian = tuijian;
	this.liuyanCount = liuyanCount;
}