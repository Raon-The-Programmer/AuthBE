const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {JWT_SECRET} =require('../utils/config')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'msdrahuljohn@gmail.com',
        pass:'ctgg hbrr vjyt qrpj '
    }
})


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

loginRouter.post('/resetPassword',async(req,res)=>{
  const {email} = req.body.email
  try {
    const user = await User.findOne({email})
    if(!user){
        res.status(401).json({Message:"User not found:("})
    }
    const resetToken = Math.random().toString(36).substring(7)
    user.token = resetToken
    console.log(token)
    console.log(resetToken)
    await user.save()

    const myMail = {
        from:'msdrahuljohn@gmail.com',
        to:email,
        subject:'Password Reset',
        html:'<p>Click The link to reset your password:  <a href="http://localhost:3000/reset/${token}">RESET PASSWORD</a></p>'
    }

    transporter.sendMail(myMail,(err)=>{
        if(err){
            console.error('Error sending mail: ',err)
            return res.status(500).json({Message:"Error while handling mail"})
        }
        return res.status(200).json({ message: 'Reset email sent successfully' });
    })
  }
  catch(err){
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  
  }
})

loginRouter.post('/password-reset-submit/:resetToken', async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await User.findOne({ resetToken });
  
      if (!user) {
        return res.status(404).json({ message: 'Invalid reset token' });
      }
  
      // Update user's password and clear resetToken
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.resetToken = undefined;
      await user.save();
  
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = loginRouter