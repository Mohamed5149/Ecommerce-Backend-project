const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    discount:{
        type:Number
    },
    category:{
        type:String
    },
    userid:
    {
        type:String
    }
})

const Product = mongoose.model('products',schema);

module.exports = Product;