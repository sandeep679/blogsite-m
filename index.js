import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import env from 'dotenv';

import UserRoute from './routes/user.js'
import BlogRoute from './routes/blog.js'

import Blog from './models/blog.js'

import {checkForAuthenticationCookie} from './middlewares/authentication.js'
env.config();

const app = express();
const port =process.env.PORT;

let url = process.env.URL
mongoose.connect(url);

app.set('view engine','ejs');
app.set("views",path.resolve('./views'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')))

app.use(checkForAuthenticationCookie('token'))

app.use('/user',UserRoute);
app.use('/blog',BlogRoute);

app.get('/',async(req,res)=>{
    const allBlog =await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlog,
    })
})

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})