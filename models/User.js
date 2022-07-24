const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: [5, "Username needs to be at least 5 characters long "],
    maxLength: [15, "Username cannot be any longer than 15 characters"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength:[8, "Password needs to be at least 8 characters long" ]
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt:{
    type:Date,
    default:()=>Date.now()
  },
  updatedAt:{
    type:Date,
    immutable:true,
    default:()=>Date.now()
  },
  followers:[{ type: mongoose.SchemaTypes.ObjectId,
     ref: 'User',
    default:null
  }],
  following:[{ type: mongoose.SchemaTypes.ObjectId,
     ref: 'User',
     default:null

     }]
  
})

usersSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("users", usersSchema);
module.exports = UserModel;
