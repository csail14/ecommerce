const withAuth = require('../withAuth');
const stripe = require('stripe')('sk_test_51HmzcBDCuqnThGHTEzmmnAldQlMBRWh2hsjKIWFJRYocE18vaJ0YCz8EC56zW5l97Xg4syt4Rd7zMkpmc8izfNoo00I3Ij1J8F')

module.exports = (app, db)=>{
	const orderModel = require('../models/OrderModel')(db);
	const productModel = require('../models/ProductModel')(db);

    app.post('/api/v1/add/orderdetails', withAuth, async (req, res, next)=>{
	    let response = await orderModel.saveOrderDetails(req);
	    console.log(response)
	    res.json(response)
    })

    app.post('/api/v1/add/order', withAuth, async (req, res, next)=>{
	    let response = await orderModel.saveOneOrder(req);
	    if(response.status === 500) {
	        res.json({status: 500, msg: "enregistrement de commande raté !"})
		}
		
		let orderId = response.order.insertId
		console.log('order',orderId)
	    let basket = req.body.basket;
		let totalAmount = 0;
		console.log("taille basket",basket.length)
	    for(let i = 0; i < basket.length; i++) {
			let product = await productModel.getOneProduct(basket[i].beer.id);
			console.log('product',product)
			basket[i].safePrice = product.product.price;
			console.log("basket[i].safePrice",product.price)
	        let total = Number(basket[i].safePrice) *  Number(basket[i].quantity);
			totalAmount += total;
			
	        let result2 = await orderModel.saveOrderDetails(orderId, basket[i].beer.id, basket[i].quantity, basket[i].beer.price);
	        if(result2.status === 500) {
    	        res.json({status: 500, msg: "enregistrement de détails raté !"})
    	    }
	        console.log('result2', result2);
	        let result3 = await orderModel.updateTotalAmount(totalAmount, orderId);
	        if(result3.status === 500) {
    	        res.json({status: 500, msg: "update de prix raté !"})
    	    }
	    } 
	    
	    res.json({status: 200, msg: "commande bien enregistré", orderId: orderId})
	    
	})

	app.post('/api/v1/order/payment', withAuth, async (req, res, next)=>{
		
		let order = await orderModel.getOrderById(req.body.orderId);
		console.log(order);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: parseInt(order.order.totalAmount * 100),
			currency: "eur",
			metadata: {integration_check: 'accept_a_payment'},
			receipt_email: req.body.email
		})
		
		res.json({client_secret: paymentIntent['client_secret']})
	})

	app.post('/api/v1/order/updateStatus',withAuth, async (req, res, next)=>{
		let status = await orderModel.updateStatus(req.body.status, req.body.orderId);
		console.log(status)
		
		res.json(status);
	})
}