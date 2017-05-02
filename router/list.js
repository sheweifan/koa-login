
var mongoose = require('mongoose');
var User = require('../db/user');

module.exports = (Router)=>{
	Router.get('/list',function *(){
		var data = yield User.get();
		console.log(data);
		yield this.render('pages/list', {
		  title: 'list',
		  data:data
		})
	});

}