const jwt = require('jsonwebtoken');
const secret = "pitichat";


const withAuth = (req, res, next)=>{
    const token = req.headers['x-access-token'];
    console.log('Token dans withAuth',token);
    
    jwt.verify(token, secret, (err, decode)=>{
        console.log(decode);
        
        if(err) {
          res.json({status: 500, err: err})
        } else {
            req.id = decode.id;
            req.email = decode.email;
            next();
        }
    })
    
    
}

module.exports = withAuth;