var mysql = require('./mysql');
mysql.connect();
handleDisconnect(mysql);

function Suggest(id,username,content,artical_id,email,time){
    this.id = id;
    this.username = username;
    this.content = content
    this.artical_id = artical_id;
    this.email = email;
    this.time = time;
    
	
}
module.exports = Suggest;

Suggest.getSuggestByArticleId = function(articleId,callback) {
	var sql = "SELECT * FROM liuyan l WHERE l.artical_id="+articleId
			+"ORDER BY l.time desc";
	var array=[];
	mysql.query(sql, function(err, rs, fields){
			if(err){
				info = "error";	
				callback(err,null);
				console.log(err+"======================================");
			} else{
			//id,username,content,artical_id,email,time
				rs.forEach(function(doc){
				console.log(doc.is_leave+"======================================");
					var article=new Post(doc.id,doc.username,doc.content,doc.artical_id,doc.email,doc.time)
					array.push(article);
				});	
				callback(null,array);
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