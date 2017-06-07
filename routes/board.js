var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Board    = require('../models/Board');   //게시판 스키마 정보
var Counter  = require('../models/Counter');   //게시글 수 스키마 정보
var async    = require('async');

//무조건 '/'를 넣어줘야 함 필수임.
router.get('/', function(req,res){
  console.log("1 board - boardList");
  Board.find(function(err, Board){
        if(err) return res.status(500).send({error: 'database failure'});
        //console.log(Board);
        res.render('../views/board/boardList', {
          postsMessage : "Data success.",
          board : Board
        });
  }).sort('-idx'); //내림차순
  //res.render('../views/board/boardList', {
  //  postsMessage : "Please login first."
  //}); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
}); // List

//무조건 '/'를 넣어줘야 함 필수임.
router.get('/boardView/:id', function(req,res){
  Board.findOne({_id: req.params.id}, function(err, Board){
      if(err) return res.status(500).send({error: 'database failure'});
      Board.hit = Board.hit + 1;  //조회수 증가
      Board.save();               //조회수 저장
      res.render('../views/board/boardView', {
        postsMessage : "Data success.",
        board : Board
      });
  });
  //res.render('../views/board/boardList', {
  //  postsMessage : "Please login first."
  //}); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
}); // List

//무조건 '/'를 넣어줘야 함 필수임.
router.get('/boardUpdate/:id', function(req,res){
  console.log("2 board - boardUpdate");
  console.log("id = " + req.params.id);
  Board.findOne({_id: req.params.id}, function(err, Board){
      if(err) return res.status(500).send({error: 'database failure'});
      console.log(Board);
      res.render('../views/board/boardUpdate', {
        postsMessage : "Data success.",
        board : Board
      });
  });
}); // Update

//게시판 목록 페이지 이동
router.get('/board', function(req,res){
  console.log("2 board - boardList");
  Board.find(function(err, Board){
      if(err) return res.status(500).send({error: 'database failure'});
      console.log(Board);
      res.render('../views/board/boardList', {
        postsMessage : "Data success.",
        board : Board
      });
  })
}); // List

//게시판 등록 페이지 이동
router.get('/boardNew', function(req,res){
  console.log("board - boardNew");
  res.render('../views/board/boardNew', {
    postsMessage : "Please login third."
  }); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
}); // new

router.post('/', function(req,res){
	console.log("SAVE");
  async.waterfall([function(callback){
    Counter.findOne({name:"board"}, function (err,counter) {
      if(err) callback(err);
      if(counter){
         callback(null, counter);
      } else {
        Counter.create({name:"board",totalCount:0},function(err,counter){
          if(err) return res.json({success:false, message:err});
          callback(null, counter);
        });
      }
    });
  }],function(callback, counter){
    Board.idx   = counter.totalCount+1;
    Board.title = req.body.title;
    Board.contents = req.body.contents;
    Board.writer = req.body.writer;

    Board.create(Board,function (err,post) {
      if(err) return res.json({success:false, message:err});
      counter.totalCount++;
      counter.save();
      res.redirect('/board');
    });
  });
  /*
  var v_idx = 0;
  Counter.findOne({name:"board"}, function (err,counter) {
      if(err) console.log(err);
      if(counter){
         console.log(err);
      } else {
        Counter.create({name:"board",totalCount:0},function(err,counter){
          if(err) return res.json({success:false, message:err});
          console.log("counter= " + counter);
          v_idx = counter.totalCount + 1;
        });
      }
  });

  Board.idx   = v_idx;
  Board.title = req.body.title;
  Board.contents = req.body.contents;
  Board.writer = req.body.writer;

  var post = new Board({
    idx :      Board.idx,
    title :    Board.title,
    contents : Board.contents,
    writer :   Board.writer,
    hit : 0
  })
  post.save(function (err) {
    if (err) { console.error(err); }
    Counter.totalCount++;
    Counter.save();
    //res.json(201, post)
    res.redirect('/board');
  })*/
}); // create

router.post('/:id', function(req,res){
	console.log("Update");
  Board.title = req.body.title;
  Board.contents = req.body.contents;
  Board.writer = req.body.writer;

  Board.update(
    { _id: req.params.id },
    {
      title: Board.title,
      writer: Board.writer,
      contents: Board.contents,
      hit : 2
    },
    { upsert: true },
    function(err){
      if (err) { console.error(err); }
      //res.json({message: 'book updated'});
      res.redirect('/board');
   });

}); // Update

router.get('/delete/:id', function(req,res){
	console.log("Delete");
	console.log(req.params.id);

  Board.deleteOne( { "_id" : req.params.id },
  function(err){
    if (err) { console.error(err); }
    //res.json({message: 'book updated'});
    res.redirect('/board');
  });

}); // delete

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("postsMessage","Please login first.");
  res.redirect('/');
}

module.exports = router;

function createSearch(queries){
  var findPost = {};
  if(queries.searchType && queries.searchText && queries.searchText.length >= 3){
    var searchTypes = queries.searchType.toLowerCase().split(",");
    var postQueries = [];
    if(searchTypes.indexOf("title")>=0){
      postQueries.push({ title : { $regex : new RegExp(queries.searchText, "i") } });
    }
    if(searchTypes.indexOf("body")>=0){
      postQueries.push({ body : { $regex : new RegExp(queries.searchText, "i") } });
    }
    if(postQueries.length > 0) findPost = {$or:postQueries};
  }
  return { searchType:queries.searchType, searchText:queries.searchText,
    findPost:findPost};
}

function doUpdateHit(req, res){
    var numHit = 0;
    console.log("2 board - boardDetail");
    console.log("id = " + req.params.id);

    Board.findOne({_id: req.params.id}, function(err, Board){
        if(err) return res.status(500).send({error: 'database failure'});
        console.log("Board.hit=> " + Board.hit);
        numHit = Number(Board.hit) + 1;

        console.log("hit = " + numHit);
    });

    Board.update(
      { _id: req.params.id },
      {
        hit : numHit
      },
      { upsert: true },
      function(err){
        if (err) { console.error(err); }
        //res.json({message: 'book updated'});
        console.log("success");
     });


}
