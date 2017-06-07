var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var async    = require('async');

//index.ejs 페이지로 이동
router.get('/', function(req,res){
  console.log("index.ejs");
  //req.flash("postsMessage","Welcome to My Homepage");
  //res.redirect('/home');
  //res.redirect('/board/boardList');
  res.render('../views/index', {
    postsMessage:"My JS's Homepage"
  }); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
}); // index

router.get('/bbs', function(req,res){
  console.log("home - boardList");
  //res.render('../views/board/boardList'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
  res.redirect('/board');
}); // List

router.get('/users', function(req,res){
  console.log("home - userList");
  //res.render('../views/board/boardList'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
  res.redirect('/user');
}); // List

router.get('/new', function(req,res){
  console.log("home - new");
  //res.render('../views/board/boardList'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
  res.redirect('/new');
}); // List


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
