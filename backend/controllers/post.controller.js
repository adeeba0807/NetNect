import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import Profile from "../models/profile.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";



export const activeCheck=async(req,res)=>{

         return res.status(200).json({message:"RUNNING"})
  
}



export const createPost=async(req,res)=>{
    const token = req.body.token;
    const bodyText = req.body.body;


    try{
        const user=await User.findOne({token:token});


        if(!user){
            return res.status(404).json({message:"User not found"})
        }


        const post=new Post({
           userId:user._id,
           body: bodyText,
           media: req.file ? req.file.filename : "",
            fileType: req.file ? req.file.mimetype.split("/")[0] : ""
        });

        await post.save();

        return res.status(200).json({message:"Post Created"})

    }catch(error){
        console.error("DETAILED ERROR:", error.message);
           return res.status(500).json({message:error.message});
    }
}




export const getAllPosts=async(req,res)=>{
    try{
        const posts = await Post.find().populate('userId','name username email profilePicture');

            return res.json({posts})
     
       }catch(err){
           return res.status(500).json({message:err.message})
       }

}


export const getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const posts = await Post.find({ userId }).populate('userId', 'name username email profilePicture');

        return res.json({ posts });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const deletePost=async(req,res)=>{
    const {token,post_id}=req.body;

    try{
      const user=await User
      .findOne({token:token})
      .select("_id");

      if(!user){
        return res.status(404).json({message: "User not found"});
      }
      const post=await Post.findOne({_id:post_id});

       if(!post){
        return res.status(404).json({message: "Post not found"})
      }

    if(post.userId.toString() !== user._id.toString()){
        return res.status(401).json({message:"Unauthorised"})
      }

      await Post.deleteOne({_id:post_id});


      return res.json({message:"Post Deleted"})


    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const get_comments_by_post=async(req,res)=>{
    const { post_id } = req.query;


    try{
        if (!post_id) {
            return res.status(400).json({ message: "post_id is required" });
        }

        const comments = await Comment.find({ postId: post_id })
            .populate('userId', 'name username email profilePicture')
            .sort({ _id: -1 });

        return res.json({ comments });
    }catch(err){
        return res.status(500).json({message:err.message})
   
    }
}

export const delete_comment_of_user=async(req,res)=>{

    const {token,comment_id}=req.body;


    try{
        const user=await User
            .findOne({token:token})
            .select("_id");

            if(!user){
        return res.status(404).json({message: "User not found"})
      }

      const comment=await Comment.findOne({"_id":comment_id})


      if(!comment){
        return res.status(404).json({message:"Comment not found"});
      }


        if(comment.userId.toString() !== user._id.toString()){
        return res.status(401).json({message:"Unauthorised"})
      }

      await Comment.deleteOne({"_id":comment_id});

      return res.json({message:"Comment Deleted"})
    }catch(err){
          return res.status(500).json({message:err.message})
   
    }


}


export const increment_likes=async(req,res)=>{


    const {post_id}=req.body;
    try{

        const post=await Post.findOne({_id:post_id});
          

            if(!post){
        return res.status(404).json({message: "Post not found"})
      }


      post.likes=post.likes+1;


      await post.save();
      return res.json({message:"Likes Incremented"})
       
    }catch(err){
        return res.status(500).json({message:err.message})
   
    }
}