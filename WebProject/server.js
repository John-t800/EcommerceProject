const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const users_auth = require('./routers/users_auth.js');
dotenv.config();

mongoose.connect(process.env.CLOUD_DB)
.then(()=>{
  console.log('DB CONNECTED');
})
.catch(e => {
  console.log(e);
})

app.use('/users', users_auth);

app.listen(process.env.PORT, ()=>{
  console.log('SERVER IS WORKING');
})
