var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
var until = require('../until');
// console.log('match',until.getSha1('sheweifan') === until.getSha1('sheweifan'));

var userSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	}
});

userSchema.pre('save', function(next) {
	var user = this
	this.password = until.getSha1(this.password);
	// console.log(this)
	next();
});

// userSchema.methods = {
// 	comparePassword :(p1,p2)=>{
// 		return until.getSha1(p1) === p2;
// 	}
// };

userSchema.statics = {
	get:function(){
		return this.find({});
	},
	getOne:function(fillter){
		return this.find(fillter)
	}
	// ,
	// update:function(newValue,oldValue){
	// 	return this.update(newValue,oldValue)
	// }
};

var userModel = mongoose.model('user',userSchema);



module.exports = userModel;
