var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var async    = require('async');

//무조건 '/'를 넣어줘야 함 필수임.
router.get('/', function(req,res){
  console.log("user - userList");
  res.render('../views/user/userList'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
}); // List

//사용자 목록 페이지 이동
router.get('/userList', function(req,res){
  console.log("user - userList");
  res.render('../views/user/userList'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
}); // List

//사용자 등록 페이지 이동
router.get('/userNew', function(req,res){
  console.log("user - userNew");
  res.render('../views/user/userNew'); //현재 controllers.js 파일 기준으로 파일 경로를 찾는다.
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
