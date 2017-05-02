
var User = require('../db/user');
// console.log(User.update);
// User.get().then(data=>{console.log(data)})
var until = require('../until');
module.exports = (Router)=>{

	Router.get('/islogined',function *(){

		if(this.session.user && this.session.user.compare){
			this.body = this.session.user;
		}else{
			this.body = false;
		}

	});

	Router.post('/login',function *(next){
		var req = this.request.body;

		var f_user = yield User.getOne({username:req.name,password:until.getSha1(req.password)});
		// var ismatch = until.comparePassword(req.password,f_user[0].password);
		// console.log(111,);
		// console.log(f_user)
		if(f_user.length === 1){
			var obj = {
				compare:true,
				name:req.name
			}
			this.session.user = obj
			this.body= obj
		}else{
			this.body={
				compare:false
			}
		}
	});

	Router.get('/logout',function *(next){
		try{
			delete this.session.user;
		}catch(e){
			console.log(e);
		}
		this.body=true;
	});

	Router.post('/register',function *(next){
		var req = this.request.body;

		var data = yield User.getOne({username:req.name});
		// console.log(data)
		if(data.length>0){
			this.body = {
				success:false,
				repeat:true
			}
			return;
		}

		var _user = new User({
			username:req.name,
			password:req.password
		});

		var save = yield _user.save();
		// console.log(save)
		
		// var data = yield User.get()
		// console.log('123',data)
		// var data = yield User.getOne({_id:_user.id})
		// console.log('256',data)
		if(save){
			//自动登陆
			this.session.user = {
				compare:true,
				name:_user.username
			}
			this.body= {
				success:true,
				repeat:false,
				// name:_user.username
			}
		}else{
			this.body= {
				success:false,
				repeat:false
			};
		}

	});

	Router.post('/update',function *(next){
		var req = this.request.body;
		var username = this.session.user.name;
		// console.log(0,req)
		// var data = yield User.getOne();
		// console.log(1,data)
		var data = yield User.update({username:username},{$set:{password:until.getSha1(req.password)} })
		// console.log(2,data)
		// data = yield User.getOne({username:username});
		// console.log(3,data)
		// data = yield User.getOne({_id:data[0]._id});
		// console.log(4,data)
		this.body = true;
	});



}