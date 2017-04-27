'use strict';
var Koa = require('koa');
var mongoose = require('mongoose');

var Router = require('koa-router')();
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var ejs = require('koa-ejs');
var views = require('koa-views');
var static_ = require('koa-static');
var moment = require('moment');
var Promise = require('bluebird');


var mongoUrl = 'mongodb://localhost/test';
mongoose.Promise = Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on('error',console.error.bind(console,'连接错误:'));
// mongoose.connection.once('open',function(){
// 	//一次打开记录
// 	console.log('一次打开记录')
// });

var app = new Koa();
app.keys = ['test']
app.use(session(app))
app.use(bodyParser());


app.use(static_(__dirname + '/app'));
app.use(views(__dirname + '/app/views', {
  extension: 'ejs',
  locals: {
    moment: moment
  }
}))

Router.get('/',function *(next) {
    yield this.render('pages/index', {
      title: '首页'
    })
});
Router.get('/test',function *(next) {
    yield this.render('pages/test', {
      title: 'test'
    })
});


require('./router/user')(Router);

app.use(Router.routes());


app.listen(18080);
console.log('running');

