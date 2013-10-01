/**
*希望我的项目可以早点出来 呵呵加油！
*每天抽一点时间完善我的网站 希望他茁壮成长 哈哈 借以此激励自己
*/
var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	settings = require('./settings'),//保存session
	flash = require('connect-flash');//保存用户信息哦传递参数
	
var app = express();//加载mvc嘿嘿
app.set("port",5807);//我喜欢这个端口 不知道为啥
app.set('view engine', 'ejs');//用ejs 就是jsp类似哦 其他格式不太会 没时间学
//定义常用路径
app.set('views', __dirname + '/views');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));

app.use(flash());
app.use(express.bodyParser());//解析request参数
app.use(express.methodOverride());//其实这个用不到 照抄
app.use(express.cookieParser());//不解释

app.use(express.session({//session定义
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}//30 days
 
}));
app.use(app.router);//分发请求路径

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//启动http监听了
http.createServer(app).listen(app.get('port'), function(){
  console.log('babata 项目启动了 端口号： ' + app.get('port'));
});


routes(app);//将项目分发到 路由里面
