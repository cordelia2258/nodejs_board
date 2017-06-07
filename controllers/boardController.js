var bodyParser = require('body-Parser');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/test');

module.exports = function(app){
  app.get("/", function(req, res){
    //res.send("Hello World!2!");
    //res.render('boardView',{title: "Board", content:"Test"});
    console.log("connect");

    res.render('../views/index'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
  });

  app.get('/board/boardNew', function(req,res){
    console.log("boardNew");
    res.render('../views/board/boardNew'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
  }); // new

  app.get('/board/boardList', function(req,res){
    console.log("boardList");
    res.render('../views/board/boardList'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
  }); // new

  app.listen(3000, function(){
    console.log("Server On!!");
  });
};
