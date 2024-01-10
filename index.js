const mongoose = require("mongoose");
const { MONGODB_URL,PORT } = require("./utils/config");
const express = require('express')
const cors = require('cors')
const app = express()
const userRouter = require('./controllers/users');
const loginRouter = require("./controllers/login");


app.use(express.json())
app.use(cors())


mongoose.set('strictQuery',false)


mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log('Conected to database!')
        app.listen(PORT,()=>{
            console.log(`Server started to listen the port ${PORT}`)
        })
    }).catch((err)=>{
        console.error('Error Message: ',err)
    })

app.use('/users',userRouter)
app.use('/login',loginRouter)