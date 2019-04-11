var express = require('express');
const createError = require('http-errors');
var Product = require('../models/product');
var router = express.Router();
const authenticationMiddWare = require('../middleware/authentication');


// get all products
router.get('/',authenticationMiddWare,async (req,res,next)=>{
    console.log("getting all products");
        let productList = await Product.find();
        res.send(productList);
});

// get all products for certain user
router.get('/:userid',authenticationMiddWare,async (req,res,next)=>{
    let productList = await Product.find({userid:req.params.userid});
    res.send(productList);
})

// add products
router.post('/', authenticationMiddWare ,(req,res,next)=>{
    const { name, description, price, discount, category,userid } = req.body;
    const product = new Product({ name, description, price, discount, category,userid });
    product.save((err)=>{
        if (err) return next(createError(401,err))
        res.send(product);
    })
})

// update products
router.patch('/:productID',authenticationMiddWare, async(req,res,next)=>{
    const _id = req.params.productID;
    let product = await Product.findByIdAndUpdate(_id,req.body);
    console.log(product);
    res.send(product);
})

//delete products
router.delete('/:productid',authenticationMiddWare, async (req,res,next)=>{
    let product = await Product.find({_id:req.params.productid});
    if(!product) return next(createError(404,"Product Not Found !"));
    const productid = req.params.productid;
    const {userid} = req.body;
    let productOwner = product.userid;
    if(productOwner !== userid) return next(createError(401,"You Can Not Delete This Product !"));
    let deletedProduct = await Product.deleteOne({_id:productid});
    res.send(deletedProduct);
})

module.exports = router;