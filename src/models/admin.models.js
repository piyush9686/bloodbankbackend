import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken:{
        type: String,
    },

}, { timestamps: true });




//passs encrypp
adminSchema.pre("save", async function () { 
    
        //()=>{} callback function not use here because of 'this' keyword
    if(!this.isModified("password")) return ;  //if password is not modified then skip hashing
     this.password=await bcrypt.hash(this.password, 10);
       //hash the password before saving
});


adminSchema.methods.isPasswordCorrect=async function(Password){ 
   return await bcrypt.compare(Password,this.password);
}


adminSchema.methods.generateAccessToken=function(){      //sing method generat access token
   return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRES}
)
}
adminSchema.methods.generateRefreshToken=function(){
     return jwt.sign({
        _id: this._id,
    
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRES}
)
}
export const Admin=mongoose.model("Admin", adminSchema);
