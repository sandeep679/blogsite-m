import { Router } from "express";
import Blog from "../models/blog.js"  
import Comment from "../models/comment.js"  
import multer from "multer";
import path from 'path'

const router =Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const fName=`${Date.now()}-${file.originalname}`;
      cb(null, fName)
    }
  })
  
  const upload = multer({ storage: storage })


router.get('/add-new',(req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
})
router.post('/',upload.single('coverImage'),async(req,res)=>{
    // console.log(req.body)
    // console.log(req.file)


    const {title,body} =req.body;
    const blog =await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImage:`uploads/${req.file.filename}`,
    });


    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id',async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({blogId:req.params.id}).populate('createdBy');
  // console.log(blog)
  console.log(comments);
  return res.render('blog',{
    user:req.user,
    blog:blog,
    comments,
  })
})


router.post('/comment/:blogId',async(req,res)=>{
  await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);

})


router.get('/delete/:id',async(req,res)=>{
  const _id=req.params.id;
  console.log(_id);
 await Blog.findByIdAndDelete({_id});
 return res.redirect('/user/profile')
  
})

router.get('/update/:id',async(req,res)=>{
  const blog = await Blog.findById(req.params.id)
  
  
  return res.render('updateBlog',{
    user:req.user,
    blog:blog,
  })
  
})

router.post('/update/:id',async(req,res)=>{
  const _id =req.params.id;
   
  await Blog.findByIdAndUpdate(_id, {title:req.body.title , body:req.body.body});
  return res.redirect('/user/profile');
  
})




export default router;