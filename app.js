'use strict';
var Koa = require('koa');

var Router = require('koa-router')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var ejs = require('koa-ejs')

var app = new Koa();




app.listen(18080);
console.log('running');