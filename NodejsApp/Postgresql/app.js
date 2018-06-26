var express = require('express');
var pgclient = require('./postgrelsql');// 引用PostgreSql数据库文件上述文件

var ServerApp = express();
pgclient.getConnection();
//保存数据
ServerApp.get("/save", function(request, response) {
  let maxId = 0;
  let tablename = "t_points";
  let maxField = "id";
  var datas = request.query.datas;
  var type = request.query.type;
  var wkid = request.query.wkid;
  var callback = request.query.callback;
  pgclient.selectMaxID(tablename,maxField,function(res){
    if(!res){
      maxId = 0
    }else{
      maxId = res;
    }
    maxId++;
    var saveData ={
      "id":maxId,
      "type":type,
      "points":datas,
      "wkid":wkid
    }
    pgclient.save(tablename,saveData,function(res){
      var success = 200;
      if(res=="err"){
        success = 400;
      }
      status = callback + "(" + success + ")";
      response.send(status);
    });
  });
});

//读取数据
ServerApp.get('/getAll', function(request, response) {
  //response.setHeader("Access-Control-Allow-Origin", "*");
  var callback = request.query.callback;
  pgclient.select("t_points","","",function(res){
    var data = JSON.stringify(res);    
    console.log(data);
    response.send(callback + '('+ data +')');
  });
});
ServerApp.get('/getAllWkid',function(request,response){
  var callback = request.query.callback;
  pgclient.select("t_spatialrefence","","",function(res){
    var data = JSON.stringify(res);
    console.log(data);
    response.send(callback + '('+ data +')');
  });
})

 var server = ServerApp.listen(8081, function() {
   var host = server.address().address;
  var port = server.address().port;
  console.log('background  app listening at http://%s:%s', host, port);
});
