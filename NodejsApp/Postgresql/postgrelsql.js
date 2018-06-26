var pg = require('pg');
var databasehost="192.168.10.137"
var conString = "postgres://postgres:esri@123@"+databasehost+"/postgres";
var client = new pg.Client(conString);

var postgrelsql = function() {
	console.log("准备向"+databasehost+"数据库连接...");
};
postgrelsql.prototype.getConnection = function() {
	client.connect(function(err) {
		if (err) {
			return console.error('无法连接到 Postgres数据库', err);
		}
		client.query('SELECT NOW() AS "theTime"', function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("Postgres数据库连接成功...");
		});
	});
};
// 查询函数  
//@param str 查询语句  
//@param value 相关值  
//@param cb 回调函数  
var clientHelper = function(str, value, cb) {
	console.log(str);
	console.log(value);
	client.query(str, value, function(err, result) {
		if (err) {
			cb("err");
		} else {
			if (result.rows != undefined)
				cb(result.rows);
			else
				cb();
		}
	});
}

//增  
//@param tablename 数据表名称  
//@param fields 更新的字段和值，json格式  
//@param cb 回调函数  
postgrelsql.prototype.save = function(tablename, fields, cb) {
	if (!tablename) return;
	var str = "insert into " + tablename + "(";
	var field = [];
	var value = [];
	var num = [];
	var count = 0;
	for (var i in fields) {
		count++;
		field.push(i);
		value.push(fields[i]);
		num.push("$" + count);
	}
	str += field.join(",") + ") values(" + num.join(",") + ")";
	clientHelper(str, value, cb);
};


postgrelsql.prototype.selectMaxID = function(tablename, maxfield, cb) {
	if (!tablename)
		return;
	var str = "select max(" + maxfield + ") as max_id from " + tablename;
	client.query(str, function(err, result) {
		if (err) {
			cb("err");
		} else {
			if (result.rows != undefined)
				cb(result.rows[0].max_id);
			else
				cb();
		}
	})
}

//删除
//@param tablename 数据表名称
//@param fields 条件字段和值，json格式
//@param cb 回调函数
postgrelsql.prototype.remove = function(tablename,fields,cb){
    if(!tablename) return;
    var str = "delete from "+tablename+" where ";
    var field = [];
    var value = [];
    var count = 0;
    for(var i in fields){
        count++;
        field.push(i+"=$" +count);
        value.push(fields[i]);
    }
    str += field.join(" and ");
    clientHelper(str,value,cb);
}

//修改
//@param tablename 数据表名称
//@param fields 更新的字段和值，json格式
//@param mainfields 条件字段和值，json格式
postgrelsql.prototype.update = function(tablename,mainfields,fields,cb){
    if(!tablename) return;
    var str = "update "+tablename+" set ";
    var field = [];
    var value = [];
    var count = 0;
    for(var i in fields){
        count++;
        field.push(i+"=$"+count);
        value.push(fields[i]);
    }
    str += field.join(",") +" where ";
    field = [];
    for(var j in mainfields){
        count++;
        field.push(j+"=$"+count);
        value.push(mainfields[j]);
    }
    str += field.join(" and ");
    clientHelper(str,value,cb);
}

//查询  
//@param tablename 数据表名称  
//@param fields 条件字段和值，json格式  
//@param returnfields 返回字段  
//@param cb 回调函数  
postgrelsql.prototype.select = function(tablename, fields, returnfields, cb) {
	if (!tablename) return;
	var returnStr = "";
	if (returnfields.length == 0)
		returnStr = '*';
	else
		returnStr = returnfields.join(",");

	if (fields && fileds.length > 0) {
		var str = "select " + returnStr + " from " + tablename + " where ";
		var field = [];
		var value = [];
		var count = 0;
		for (var i in fields) {
			count++;
			field.push(i + "=$" + count);
			value.push(fields[i]);
		}
		str += field.join(" and ");
		clientHelper(str, value, cb);
	}else{
		var str = "select " + returnStr + " from " + tablename ;
		clientHelper(str, value, cb);
	}
};
module.exports = new postgrelsql();