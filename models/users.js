const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rounds = process.env.ROUNDS || 10;
const sKey = "sKey";

const sign = (...args)=>{
    return new Promise((resolve,reject)=>{
        jwt.sign(...args,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}


const verify = (...args)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(...args,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        },
    },
    password: {
        type: String,
        required: true
    },
}, {
        toJSON: {
            hide: "password",
            transform: true
        }
    });

schema.options.toJSON.transform = function (doc, ret, options) {
    if (options.hide) {
        options.hide.split(' ').forEach((prop) => { delete ret[prop] });
    }
}

const hashPassword = password => bcrypt.hash(password, rounds);

schema.pre('save', async function () {
    if (this.isNew || this.modifiedPaths.includes('password')) {
        this.password = await hashPassword(this.password);
    }
})

schema.method('verifyPassword',function(pass){
    return bcrypt.compare(pass,this.password);
})

schema.method('generateToken',function(){
    const token = sign({_id:this.id},sKey,{expiresIn:'30m'});
    return token;
})

schema.static('decodeToken',function(token){
    return verify(token,sKey);
})

const User = mongoose.model('users', schema);

module.exports = User;