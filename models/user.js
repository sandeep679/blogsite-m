import mongoose from "mongoose";
import {createHmac,randomBytes} from 'crypto';
import { createTokenForUser } from "../services/authentication.js";

const userSchema =new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:"/images/default.svg"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
},{timestamps:true});

userSchema.pre('save',function(next){
    const user =this;

    if(!user.isModified) return;

    const salt=randomBytes(16).toString();
    const hash=createHmac('sha256', salt)
                        .update(user.password)
                        .digest('hex');

    this.salt=salt;
    this.password=hash;
    next();
})

userSchema.static('matchPasswordandGenerateToken', async function(email,password){
    const user=await this.findOne({email});

    if(!user) throw new Error("User not found");

    const salt=user.salt;
    const  hashedpassword=user.password;

    const userProvidedHash=createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(hashedpassword!==userProvidedHash) throw new Error("User incorrect details");

    const token =createTokenForUser(user);
    return {token,user};
     
})



const User =mongoose.model('user',userSchema);


export default User;