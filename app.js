var express = require("express");
var path     = require('path');
var mongoose = require('mongoose');
var session  = require('express-session');
var flash    = require('connect-flash');
var bodyParser  = require('body-parser');
var boardController = require('./controllers/boardController');
var app = express();

// database Connection
mongoose.connect("mongodb://admin:admin@ds151451.mlab.com:51451/board");
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

//set up template engine
app.set('view engine', 'ejs');
//common을 공통폴더로 지정하였기에 경로를 찾을땐 url창에서 common을 제외해야함.
app.use(express.static(path.join(__dirname, 'common')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(session({secret:'MySecret'}));
app.use('/', require('./routes/index'));      //초기화면
app.use('/home', require('./routes/home'));   //메인 페이지
app.use('/board', require('./routes/board')); //게시판관리
app.use('/user', require('./routes/user'));   //사용자관리

//app.use('/board', require('./routes/board'));

// start server
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});

//fire controllers
//boardController(app);

//app.listen(3000);
//console.log('You are listening to port 3000');
