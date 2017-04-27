
var User = require('../db/user');
User.get().then(data=>{console.log(data)})
var until = require('../until');
module.exports = (Router)=>{

	

	Router.get('/islogined',function *(){

		if(this.session.user && this.session.user.verify){
			this.body = this.session.user;
		}else{
			this.body = false;
		}

	});

	Router.post('/login',function *(next){
		var req = this.request.body;

		var f_user = yield User.getOne({username:req.name});
		var ismatch = until.comparePassword(req.password,f_user[0].password);
		// console.log(111,);
		// console.log(password)
		if(ismatch){
			var obj = {
				verify:true,
				name:req.name
			}
			this.session.user = obj
			this.body= obj
		}else{
			this.body={
				verify:false
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
				verify:true,
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
}