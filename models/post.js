var mysql = require('./mysql');
mysql.connect();
handleDisconnect(mysql);

function Post(id,content,type,time,title,biaoqian,tuijian,liuyanCount,content_leave,is_leave){
    this.id = id;
    this.content = content;
    this.type = type
    this.time = time;
    this.title = title;
    this.biaoqian = biaoqian;
    this.tuijian = tuijian;
	this.liuyanCount = liuyanCount;
	this.contentLeave = content_leave;
	this.isLeave = is_leave;
	
}
function Suggest(id,username,content,artical_id,email,time,ipStr){
    this.id = id;
    this.username = username;
    this.content = content
    this.artical_id = artical_id;
    this.email = email;
    this.time = time;
	this.ipStr = ipStr;
}
module.exports = Post;

Post.getArticle = function(callback) {
	var sql = "select a.*,(SELECT count(*) from liuyan l WHERE l.artical_id=a.id) as liuyanCount,t.`name` as type "+
			  "from article a  LEFT OUTER JOIN type t ON t.id=a.type where tuijian = 1";
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				callback(err,null);
				console.log(err+"======================================");
			} else{
			//id,content,type,time,title,biaoqian,tuijian
				rs.forEach(function(doc){
				console.log(doc.is_leave+"======================================");
					var article=new Post(doc.id,doc.content,doc.type,doc.time,doc.title,doc.biaoqian,doc.tuijian,doc.liuyanCount,doc.content_leave,doc.is_leave)
					array.push(article);
					console.log(article);
				});	
				callback(null,array);
			}
	});
};

Post.findArticle = function(titleSearch,callback) {//返回所有文章
  var sql = "select a.*,(SELECT count(*) from liuyan l WHERE l.artical_id=a.id) as liuyanCount,t.`name` as type "+
			  "from article a  LEFT OUTER JOIN type t ON t.id=a.type where tuijian = 1 AND a.title like " + "'%"+titleSearch+"%'";
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				callback(err,null);
			} else{
			//id,content,type,time,title,biaoqian,tuijian
				rs.forEach(function(doc){
					var post=new Post(doc.id,doc.content,doc.type,doc.time,doc.title,doc.biaoqian,doc.tuijian,doc.liuyanCount,doc.content_leave,doc.is_leave)
					array.push(post);	
				});
				callback(null,array);
			}
	});
};

Post.findDetail = function(id,callback) {//返回所有文章
  var sql = "select a.*,(SELECT count(*) from liuyan l WHERE l.artical_id=a.id) as liuyanCount,t.`name` as type "+
			  "from article a  LEFT OUTER JOIN type t ON t.id=a.type where tuijian = 1 AND a.id =" + id;
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				callback(err,null);
			} else{
			//id,content,type,time,title,biaoqian,tuijian
				rs.forEach(function(doc){
					var post=new Post(doc.id,doc.content,doc.type,doc.time,doc.title,doc.biaoqian,doc.tuijian,doc.liuyanCount,doc.content_leave,doc.is_leave)
					console.log(post);
					console.log("===================findDetail");
					array.push(post);	
				});
				 console.log(array+"=====================findDetail=");
				callback(null,array);
			}
	});
};
//================================================================================suggest
Post.getSuggestByArticleId = function(articleId,callback) {
	var sql = "SELECT * FROM liuyan l WHERE l.artical_id= "+articleId
			+" ORDER BY l.id desc";
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				callback(err,null);
				console.log(err+"======================================");
			} else{
			//id,username,content,artical_id,email,time
				rs.forEach(function(doc){
				console.log(doc.is_leave+"======================================getSuggestByArticleId");
					var article=new Suggest(doc.id,doc.username,doc.content,doc.artical_id,doc.email,doc.time,doc.ipStr)
					array.push(article);
				});	
				callback(null,array);
			}
	});
};

Post.saveSuggest = function(req,callback) {
	var articleId = req.body.articleId;
	var name = req.body.name;
	var email = req.body.email;
	var ipStr = req.body.ipStr;
	var content = req.body.content;
	var date = new Date(),
    time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	var sql = "INSERT INTO liuyan(username,content,artical_id,email,time,ipStr) values('" + name  + "','" + content  +"','"+ articleId + "','" + email  + "','" + time + "','" + ipStr + "')";
	console.log(sql);
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				callback(err,null);
				
			} else{
				callback(null,"ok");
			}
	});
};






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