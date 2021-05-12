const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secret = "pitichat";

const fileUpload = require("express-fileupload");
app.use(fileUpload({
    createParentPath: true
}))

const withAuth = require('./withAuth');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cors());

const mysql = require('promise-mysql');

mysql.createConnection({
	host: "home.3wa.io",
	database: "fsjs-02_camillesai_beer4you",
	user: "camillesai",
	password: "b9b1b410ZmRiZjEzYzI2OWY5MjRjZjNiYWI4YTRic9df8326",
	port: 3307
}).then((db) => {
    console.log('connecté à la bdd');
    setInterval(async function () {
		let res = await db.query('SELECT 1');
	}, 10000);
    
    app.get('/', (req, res, next)=>{
        console.log('/ on est sur la home');
        // permet de renvoyer du json
        res.json({status: 200, msg: "ok"})
    })

    userRoutes(app, db);
    productRoutes(app, db);
    orderRoutes(app,db);    
})
.catch((err)=>{
    console.log(err);
})


const PORT = 8000;
app.listen(PORT, ()=>{
	console.log('listening port '+PORT+' all is ok');
})