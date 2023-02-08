const mongoose = require('mongoose')
/* const bcrypt = require('bcrypt') */
/* const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); */
/* const APP_HOST = process.env.APP_HOST
const PORT = process.env.PORT */

const UserScheme = new mongoose.Schema(
    {
      email:{
        type:String,
        required: true,
        unique: true
      },
      password:{
        type: String,
        required: true
      },
      role:{
        type: [Number]
      },
      name:{
        type: String,
      },
      profileImage: {
        type: String
      },
      company_id: {
        type: mongoose.ObjectId,
        ref: 'users'
      }
    },
    {
      timestamps:true,
      versionKey:false
    }
  );

module.exports = mongoose.model("users", UserScheme)