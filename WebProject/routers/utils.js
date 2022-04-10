const router = require('express').Router();
const path = require('path');
const utils = require('../controllers/utils.js');
const users_auth = require('../controllers/users_auth.js');
const users = require('../models/web_schema.js').userModel;
const bcrypt = require('bcrypt');

router.get('/sendMail', (req,res)=>{
  console.log(__dirname.split('/'));
  const dirname = __dirname.split('/');
  const path = require('path');
  dirname.pop();
  pathFile = dirname.join('/') + '/views/resetPass.html';
  console.log(pathFile);
  res.sendFile(path.join(pathFile));
})

router.post('/sendMail/resetPass', async (req,res,next)=>{
  console.log(req.body);
  const user = await users.findOne({
    email: req.body.email,
    username: req.body.username
  })
  if(user){
    console.log(user);
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(req.body.password,salt);
    await users.updateOne(user, {password: hashed_password});
    req.body = {...req.body, subject: 'Reset Password', htmlContent: `USER ${req.body.username} UPDATE PASSWORD SUCCESSFULLY`};
    console.log(user);
    next();
  }else if(!user){
    res.status(404).send('BAD REQUEST').end();
  }
}, utils.sendMail);


module.exports = router;
