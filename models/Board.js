var mongoose = require('mongoose');

//게시판 스키마 정보
var boardSchema = mongoose.Schema({
  idx :      {type: Number, default : 0},
  title :    {type: String, require : true},
  contents : {type: String, require : true},
  writer :   {type: String, require : true},
  wdate :    {type: Date, default:Date.now},
  hit :      {type: Number, default : 0}
});

function get2digits(num){
  return ("0" + num).slice(-2);
}

//생성 날짜 포멧에 맞게 구성
boardSchema.methods.getCreatedDate = function () {
  var date = this.wdate;
  return date.getFullYear() + "-" + get2digits(date.getMonth()+1)+ "-" + get2digits(date.getDate());
};

//생성 시간 포멧에 맞게 구성
boardSchema.methods.getCreatedTime = function () {
  var date = this.wdate;
  return get2digits(date.getHours()) + ":" + get2digits(date.getMinutes())+ ":" + get2digits(date.getSeconds());
};

var Board = mongoose.model('board',boardSchema);
module.exports = Board;
