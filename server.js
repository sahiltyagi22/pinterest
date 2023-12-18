const express =  require('express')
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect('mongodb://127.0.0.1/pinterest1')
.then(()=> console.log('DB connected'))
.catch((err)=>console.log(err))


app.listen(3000 , ()=>console.log('server is running'))