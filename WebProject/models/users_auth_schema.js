const mongoose = require('mongoose');

const users_schema = new mongoose.Schema({
  username:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  phone:{
    type: String,
    require: true
  },
  cart:{

  },
  history:{

  }
})

module.exports = mongoose.model('users',users_schema);
