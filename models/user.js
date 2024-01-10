const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:String,
    name:String,
    passwordHash:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:Date
})

module.exports = mongoose.model('User',userSchema,'users')
