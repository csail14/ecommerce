const bcrypt = require('bcrypt');
const saltRounds = 10;
 
module.exports = (_db)=>{
    db = _db;
    return UserModel;
}

class UserModel {
    
    static saveOneUser(req){
        return bcrypt.hash(req.body.password, saltRounds)
            .then((hash)=>{
                return db.query('INSERT INTO users (email, password, firstName, lastName, address, zip, city, phone, role, creationTimestamp, connexionTimestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "user", NOW(), NOW())', [req.body.email, hash, req.body.firstName, req.body.lastName, req.body.address, req.body.zip, req.body.city, req.body.phone])
        	    .then((result)=>{
        	        console.log('REPONSE',result)
        	       return {status: 200, msg: "utilisateur bien enregistré !"}
        	    })
        	    .catch((err)=>{
        	        return {status: 500, msg: err}
        	    })
            })
    }

    static getAllUser(req){
        return db.query("SELECT * FROM users")
        .then((result)=> {
            return {status:200,msg:'user recupéré', user:result}
        })
        .catch((err)=>{
            return {status:500,msg:err}
        })
    }
    static getUserById(req){
        return db.query("SELECT * FROM users WHERE id=?",[req.params.id])
        .then((result)=> {
            console.log('getUserByID',result)
            return {status:200,msg:'user recupéré', user:result[0]}
        })
        .catch((err)=>{
            return{status:500,msg:err}
        })
    }

    static editUserById(req){
        console.log("body",req.body)
        return db.query("UPDATE users SET firstName=?, lastName=?, email=?, password=?,role=?,address=?,zip=?,city=?,phone=?,creationTimestamp=NOW(),connexionTimestamp= NOW() WHERE id=?",[req.body.firstName, req.body.lastName,req.body.email, req.body.password, req.body.role, req.body.address, req.body.zip, req.body.city, req.body.phone,req.body.id])
        .then((result)=> {
            console.log('resultat api',result)
            return {status:200,msg:'user recupéré', result:result[0]}
        })
        .catch((err)=>{
            console.log('erreur')
            return{status:500,msg:err}
        })
    }
    static async getOneUserByMail(email) {
        return db.query('SELECT * FROM users WHERE email = ?', [email])
                .then((user)=>{
                    if(user.length === 0) {
                        return {status: 404, msg: "le mail n'existe pas dans la base de donnée"}
                    }
                    return user[0]
                })
                .catch((err)=>{
                    return err
                })
    }
    
    
    
    
}