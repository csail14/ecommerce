const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = "pitichat";
const withAuth = require('../withAuth');

module.exports = (app, db)=>{
    const userModel = require('../models/UserModel')(db);

    app.post('/api/v1/add/user', async (req, res, next)=>{
	    let response = await userModel.saveOneUser(req);
	    console.log(response)
	    res.json(response)
    })
    
    app.get('/api/v1/all/users', async (req,res, next)=> {
        let response = await userModel.getAllUser(req);
	    res.json(response)
    })
    
    app.get('/api/v1/get/user/:id', async (req,res, next)=> {
        let response = await userModel.getUserById(req);
	    res.json(response)
	})

	app.put('/api/v1/edit/user/:id', async (req,res, next)=> {
		console.log('route back');
		let response = await userModel.editUserById(req);
		let user = await userModel.getUserById(req);
		response.user = user.user;
		console.log('response',response);
	    res.json(response)
	})
	
	app.get('/api/v1/checkToken', withAuth, async  (req, res, next)=>{
		let user = await db.query('SELECT * FROM users WHERE id = ?', [req.id]);
		res.json({status: 200, msg: "Token valide", user: user[0]})
    })


	
    app.post('/api/v1/user/login', async (req, res, next)=>{
		let user = await userModel.getOneUserByMail(req.body.email)
		console.log(user);
		
		if (user.status === 404) {
			res.json(user)
		}
		
		let same = await bcrypt.compare(req.body.password, user.password);
		
		if(same) {
			let infos = {id: user.id, email: user.email}
			
			let token = jwt.sign(infos, secret);
			
			res.json({status: 200, token: token, msg: "utilisateur bien connecté"})
		} else {
			res.json({status: 401, msg: "utilisateur non autorisé"})
		}
		
	})
    
}