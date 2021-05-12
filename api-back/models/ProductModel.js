 
module.exports = (_db)=>{
    db = _db;
    return ProductModel;
}

class ProductModel {
    
    static getAllProducts(req){
        return db.query("SELECT * FROM products")
        .then((result)=> {
            return {status:200,msg:'products recupérés', products:result}
        })
        .catch((err)=>{
            return {status:500,msg:err}
        })
    }
    

    static saveOneProduct(req){
        return db.query("INSERT INTO products(name, description, price, url, quantity, creationTimestamp) VALUES (?,?,?,?,?,NOW())",[req.body.name,req.body.description,req.body.price,req.body.url,req.body.quantity])
        .then(
            (result)=> {
                return {status:200, msg:'produit ajouté'}
            })
        .catch((err)=> {
            return {status:500, msg:err}
        }
        )
    }

    static getProductById(req){
        return db.query("SELECT * FROM products WHERE id=?",[req.params.id])
        .then(
            (result)=>{
                return {status:200, msg:"produit récupéré", product:result[0]}
            })
        .catch((err)=> {
            console.log(err)
            return {status:500, msg:err}
        }
        )
    }

    static getOneProduct(id){
        return db.query("SELECT * FROM products WHERE id=?",[id])
        .then(
            (result)=>{
                return {status:200, msg:"produit récupéré", product:result[0]}
            })
        .catch((err)=> {
            console.log(err)
            return {status:500, msg:err}
        }
        )
    }

    static async modifyProductQuantity(id, quantity) {
        return db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id])
                 .then((response)=>{
                 return response
             })
             .catch((err)=>{
                 return err;
             })
     }

    static deleteProductById(req){
        return db.query("DELETE FROM products WHERE id=?",[req.params.id])
        .then(
            (result)=>{
                return {status:200, msg:"produit supprimé"}
            })
        .catch((err)=> {
            return {status:500, msg:err}
        }
        )
    }

    static setProductById(req){
        return db.query("UPDATE products SET name=?, description=?,price=?, url=?, quantity=? WHERE id=?",[req.body.name,req.body.description,req.body.price,req.body.url,req.body.quantity,req.params.id])
        .then(
            (result)=>{
                return {status:200, msg:"produit modifié"}
            })
        .catch((err)=> {
            return {status:500, msg:err}
        }
        )
    }

    static async updateTotalAmount(totalAmount, orderId){
        
       
        return db.query('UPDATE orders SET totalAmount = ? WHERE id=?', [totalAmount, orderId])
        	    .then((result)=>{
        	       return {status: 200, msg: "le total amount est bien modifié", result:result}
        	    })
        	    .catch((err)=>{
        	        return {status: 500, msg: err}
        	    })
            
    }
}