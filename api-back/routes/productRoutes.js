const withAuth = require('../withAuth');
const fs = require('fs');

module.exports = (app, db)=>{
    const productModel = require('../models/ProductModel')(db);

    app.post('/api/v1/add/product', withAuth, async (req, res, next)=>{
	    let response = await productModel.saveOneProduct(req);
	    console.log(response)
	    res.json(response)
    })

    app.post('/api/v1/add/product/pict',withAuth, (req, res, next)=> {
        req.files.image.mv('public/images/'+req.files.image.name, (err)=>{
            console.log('ça passe', 'public/images/'+req.files.image.name)
            
            if(err) {
                res.json({status:500, msg: "La photo ne s'est pas enregistrée"})
            }
            
            res.json({status: 200, msg:"Photo enregistré", url: req.files.image.name})
        })
    })
    
    app.get('/api/v1/all/products', async (req,res, next)=> {
        let response = await productModel.getAllProducts(req);
	    res.json(response)
    })

    app.get('/api/v1/get/product/:id', async (req,res, next)=> {
        let response = await productModel.getProductById(req);
	    res.json(response)
    })

    app.put('/api/v1/edit/product/:id', withAuth, async (req,res, next)=> {
        let response = await productModel.setProductById(req);
	    res.json(response)
    })

    app.delete('/api/v1/delete/product/:id',withAuth,  async (req,res, next)=> {
        let response = await productModel.deleteProductById(req);
	    res.json(response)
    })
    
    app.delete('/api/v1/delete/product/pict/:name',withAuth,  async (req,res, next)=> {
        let name = req.params.name
        fs.unlink('public/images/'+name, (err)=>{
            if(err) {
                console.log(err);
            }
            res.json({status: 200, msg: "l'image a bien été supprimé !"})
        })
    })

        
    app.put('/api/v1/product/updatequantity/:id', withAuth, async (req, res, next)=>{
        let id = req.params.id
        let product = await productModel.getOneProduct(id);
        
        let newQuantity = parseInt(product.quantity) - parseInt(req.body.quantity);
        
        let result = await productModel.modifyProductQuantity(id, newQuantity);
        
        if(result.code) {
            res.json({status: 500, err: result})
        }
        res.json({status: 200, msg: "la quntité a bien été modifié"})
    })
    
    
}