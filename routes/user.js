import { Router } from "express";
import User from "../models/user.js"  
import Blog from "../models/blog.js"  

import multer from "multer";
import path from 'path'

const router =Router();

router.get("/signin",(req,res)=>{
    res.render("signin")
})

router.post("/signin",async(req,res)=>{
    const {email,password} =req.body;
    

    try {
        const {token,user} = await User.matchPasswordandGenerateToken(email,password);
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            message:error
        })
    }
})

router.get("/signup",(req,res)=>{
    res.render("signup")
})


router.post("/signup",async(req,res)=>{
    const {fullname ,email,password} =req.body;
    console.log(req.body);
    await User.create({
        fullname,
        email,
        password
    });

    return res.redirect("/")
})

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/');
})


router.get('/profile',async(req,res)=>{
    // console.log(req.user);
    const allBlog =await Blog.find({createdBy:req.user._id});
    // console.log(allBlog.length);
    
    res.render('profile',{
        user:req.user,
        blogs:allBlog,
    })
})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images`))
    },
    filename: function (req, file, cb) {
      const fName=`${Date.now()}-${file.originalname}`;
      cb(null, fName)
    }
  })
  
const upload = multer({ storage: storage })

router.post('/profile-img',upload.single('profile'),async(req,res)=>{
    // console.log(req.body)
    console.log(req.file)
    console.log(req.user)
    await User.findByIdAndUpdate(req.user._id ,{
        profileImageURL :`images/${req.file.filename}`
    })
    return res.redirect('/user/profile');

    // const {title,body} =req.body;
    // const blog =await Blog.create({
    //     title,
    //     body,
    //     createdBy:req.user._id,
    //     coverImage:`uploads/${req.file.filename}`,
    // });
    


    // return res.redirect(`/blog/${blog._id}`);
})



export default router;