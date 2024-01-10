const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User=require('../models/user')

userRouter.post('/',async(req,res)=>{
    const {name,username,password} = req.body;
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save()
    res.json(savedUser)
})



module.exports=userRouter;