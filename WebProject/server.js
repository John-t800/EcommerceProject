const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const users_auth = require('./routers/users_auth.js');
const utils = require('./routers/utils.js');
const bodyParser = require('body-parser');
dotenv.config();

mongoose.connect(process.env.CLOUD_DB)
.then(()=>{
  console.log('DB CONNECTED');
})
.catch(e => {
  console.log(e);
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.urlencoded({extended: true})); // Cho phép lý dữ liệu từ form method POST
app.get('/', (req,res)=>{
  res.send('HOME PAGE');
});
app.use('/users', users_auth);
app.use('/utils', utils);

app.listen(process.env.PORT, ()=>{
  console.log('SERVER IS WORKING');
})
