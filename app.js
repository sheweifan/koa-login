'use strict';
var Koa = require('koa');

var Router = require('koa-router')();
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var ejs = require('koa-ejs');
var views = require('koa-views');
var moment = require('moment');

var app = new Koa();

app.use(views(__dirname + '/app/views', {
  extension: 'ejs',
  locals: {
    moment: moment
  }
}))

Router.get('/',function *(next) {
    // this.body = 'index';
    yield this.render('pages/index', {
      title: '首页'
    })
});

app.use(Router.routes());


app.listen(18080);
console.log('running');