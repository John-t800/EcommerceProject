const mongoose = require('mongoose');

const category_schema = new mongoose.Schema({
  title: String,
  list_product: [
    {
      product: {
        type: String,
        ref: 'products'
      }
    }
  ]
},{
  collection: 'categories'
});


const cart_schema = new mongoose.Schema({
  list_product: [
    {
      product: {
        type: String,
        ref: 'products'
      }
    }
  ]
},
{
  collection: 'cart'
});

const product_schema = new mongoose.Schema({
  name: String,
  price: Number,
  image: {
    data: Buffer,
    contentType: String
  },
  discription: String,
  owner: String,
  comments: [
    {
      user: {
        type: String,
        ref: 'users'
      },
      comment: String,
      images: [
        {
          data: Buffer,
          contentType: String
        }
      ]
    }
  ],
  category: {
    type: String,
    ref: 'categories'
  }
},{
  collection: 'products'
});


const users_schema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  cart:{
    type: String,
    ref: 'cart'
  },
  role:{
    type: String,
    default: 'user'
  },
  image:{
    data: Buffer,
    contentType: String
  }
},{
  collection: 'users'
})

const userModel = mongoose.model('users',users_schema);
const cartModel = mongoose.model('cart', cart_schema);
const productsModel = mongoose.model('products', product_schema);
const categoriesModel = mongoose.model('categories', category_schema);

module.exports = {
  userModel,
  cartModel,
  productsModel,
  categoriesModel
}
