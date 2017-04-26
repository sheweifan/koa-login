'use strict';
var Koa = require('koa');

var Router = require('koa-router')();
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var ejs = require('koa-ejs');
var views = require('koa-views');
var static_ = require('koa-static');
var moment = require('moment');

var app = new Koa();

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
Router.post('/login',function *(next){
	console.log('adasd')
	this.body='123'
});

app.use(Router.routes());


app.listen(18080);
console.log('running');