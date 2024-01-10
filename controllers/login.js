const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {JWT_SECRET} =require('../utils/config')

loginRouter.post('/',async(req,res)=>{
    const {username,password} = req.body

    const user = await User.findOne({username})
    if(!user){
       return res.status(401).json({
        message:"Username not found:("
       })
    }
    const isAuth = await bcrypt.compare(password,user.passwordHash)
    if(!isAuth){
        return res.status(401).json({message:"Invalid Password:("})
    }
    const payload = {
        username:user.username,
        id:user._id
    }
    const token = jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'})
    res.status(200).json({
        token,username:user.username,name:user.name
    })
})


module.exports = loginRouter