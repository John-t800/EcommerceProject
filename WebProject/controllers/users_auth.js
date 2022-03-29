const users = require('../models/users_auth_schema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
let cookies = {};

const users_auth = {
  create_refresh_token: function(payload){
    return jwt.sign(payload, process.env.REFRESH_KEY);
  },
  register: async function(req,res){
    const {username,password,email,phone} = req.body;
    const check_username = await users_auth_schema.findOne({username: username});

    if(check_username){
      res.send('USER IS ALREADY EXISTS');
      res.end();
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password,salt);
    const create_User = await new users({
      username: username,
      password: password,
      email: email,
      phone: phone
    });
    create_User.save()
    .then(()=>{
      //SEND SMS MESSAGE
      console.log('CREATE USER SUCCESS');
    })
    .catch(e => {
      res.json({
        message: 'CANNOT CREATE NEW USER'
      });
    })
  },
  login: async function(req,res){
    jwt.verify(req.cookies.usercookie, process.env.REFRESH_KEY, (err) =>{
      if(err){
        res.status(404).send('BAD REQUESTS');
      }
    });
    if([req.cookies.usercookie] !== null){
      next();
    };
    const user_info = req.body;
    const check_user = await users.findOne({username: user_info.username});
    if(!check_user){
      res.json(`CANNOT FIND USER ${username}`);
    }
    const check_password = await bcrypt.compare(check_user.password,user_info.password);
    if(!check_password){
      res.json(`USER ${username} SUBMITS WRONG PASSWORD`);
    }
    const refresh_token = users_auth_schema.create_refresh_token(user_info);
    res.cookie('usercookie',refresh_token,{
      httpOnly: false,
      secure: false
    });
    cookies[refresh_token] = JSON.stringify(check_user);
  },
  logout: function(req,res){
    delete cookies[req.cookies.usercookie];
    res.clearCookie('usercookie');
    res.end();
  }
}

module.exports = users_auth;
