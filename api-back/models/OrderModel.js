 
module.exports = (_db)=>{
    db = _db;
    return OrderModel;
}

class OrderModel {
    
    static getAllOrders(req){
        return db.query("SELECT * FROM orders")
        .then((result)=> {
            return {status:200,msg:'orders recupérés', orders:result}
        })
        .catch((err)=>{
            return {status:500,msg:err}
        })
    }

    static saveOneOrder(req){
        return db.query("INSERT INTO orders(user_id, status, totalAmount, date) VALUES (?,?,?,NOW())",[req.body.user_id,req.body.status,req.body.totalAmount])
        .then(
            (result)=> {
                return {status:200, msg:'order ajouté',order:result}
            })
        .catch((err)=> {
            return {status:500, msg:err}
        }
        )
    }
    static saveOrderDetails(orderId, id, quantity, total){
        return db.query("INSERT INTO orderdetails(orderId, productId, quantity, priceEach) VALUES (?,?,?,?)",[orderId, id, quantity, total])
        .then(
            (result)=> {
                console.log(result)
                return {status:200, msg:'order details ajoutés',order:result}
            })
        .catch((err)=> {
            return {status:500, msg:err}
        }
        )
    }

    static getOrderById(id){
        return db.query("SELECT * FROM orders WHERE id=?",[id])
        .then(
            (result)=>{
                return {status:200, msg:"order récupéré", order:result[0]}
            })
        .catch((err)=> {
            console.log(err)
            return {status:500, msg:err}
        }
        )
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
       console.log("data passée",totalAmount,orderId)
        return db.query('UPDATE orders SET totalAmount = ? WHERE id=?', [totalAmount, orderId])
        	    .then((result)=>{
        	       return {status: 200, msg: "le total amount est bien modifié", result:result}
        	    })
        	    .catch((err)=>{
        	        return {status: 500, msg: err}
        	    })
            
    }

    static async updateStatus(status, id) {
        return db.query('UPDATE orders SET status = ? WHERE id=?', [status, id])
               .then((order)=>{
                  return {status: 200, msg: "status update"}
               })
               .catch((err)=>{
                   return {status: 500, msg: err}
               })
   }
}