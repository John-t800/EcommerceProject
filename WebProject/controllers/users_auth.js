const users = require('../models/web_schema.js').userModel;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
let cookies = {};
let loginProcess;

const users_auth = {
  check_cookie: function(req,res,key_string){
    return new Promise((resolve,reject)=>{
      if(req.headers.cookie.search(key_string) !== -1){
        //usercookie=....
        const startIndex = req.headers.cookie.search(key_string) + key_string.length + 1;
        //startIndex=11
        const received_cookie = req.headers.cookie.slice(startIndex);
        jwt.verify(received_cookie,process.env.REFRESH_KEY,err => {
          if(err){
            console.log(err);
            res.send('COOKIE WRONG');
            reject(err)
          }else if(cookies[received_cookie] !== undefined){
            console.log(cookies);
            res.send('LOGIN WITH COOKIE SUCCESSFULLY');
            resolve(received_cookie);
          }
        })
      }
    })
  },
  create_refresh_token: function(payload){
    return jwt.sign(payload, process.env.REFRESH_KEY);
  },
  register: async function(req,res){
    //EMAIL IS REQUIRED
    if(req.body.email === ''){
      return res.status(404).send('PLEASE SEND YOUR EMAIL').end();
    }
    const check_username = await users.findOne({email: req.body.email});

    if(check_username){
      return res.send('USER IS ALREADY EXISTS').end();
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(req.body.password,salt);
    const create_User = await new users({
      username: req.body.username,
      password: hashed_password,
      email: req.body.email,
      phone: req.body.phone
    });
    create_User.save()
    .then(async function(){
      //SEND SMS MESSAGE
      const new_User = await users.findOne({email: req.body.email});
      res.json({
        newUser: `${JSON.stringify(new_User)}`
      })
      console.log('CREATE USER SUCCESS');
    })
    .catch(e => {
      console.log(e);
      res.json({
        message: 'CANNOT CREATE NEW USER'
      });
    })
  },
  login: async function(req,res){
    //Check if cookie is valid
    if(req.headers.cookie !== undefined){
      users_auth.check_cookie(req,res,'usercookie')
      .then((received_cookie)=>{
        console.log('END CONNECTION HERE'); //next()
        clearTimeout(loginProcess); // END PROGRAM HERE IMMEDIATELY
      })
      .catch((e)=>{
        console.log(e);
        clearTimeout(loginProcess);
      })
    };
    loginProcess = setTimeout(async ()=>{
      console.log('loginProcess START');
      const login_user = await users.findOne({email: req.body.email});
      if(!login_user){
        res.json(`CANNOT FIND USER ${req.body.username}`);
      }
      const check_password = await bcrypt.compare(req.body.password,login_user.password);
      if(!check_password){
        res.json(`USER ${req.body.username} SUBMITS WRONG PASSWORD`).end();
      }
      const refresh_token = users_auth.create_refresh_token(req.body);
      cookies[refresh_token] = JSON.stringify(req.body);
      res.cookie('usercookie',refresh_token,{
        httpOnly: false,
        secure: false
      });
      console.log('loginProcess END');
      res.end();
    },0)
  },
  logout: async function(req,res){
    if(req.headers.cookie !== undefined){
      users_auth.check_cookie(req,res,'usercookie')
      .then((received_cookie)=>{
        delete cookies[received_cookie];
        res.clearCookie('usercookie').end();
      })
      .catch((e)=>{
        console.log(e);
        return res.end();
      })
    }
  },
  forgottenPass: (req,res)=>{
    
  }
}

module.exports = users_auth;
