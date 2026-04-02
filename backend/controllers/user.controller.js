import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import fs from "fs";
import mongoose from "mongoose";
import Post from "../models/post.model.js"; 
import Comment from "../models/comments.model.js"; // Ensure this is here too

const connection = mongoose.connection;
import ConnectionRequest from "../models/connections.model.js";

export const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    // 1. ADD IMAGE GUARD: Only try to add image if it exists
    if (userData.userId.profilePicture && fs.existsSync(`uploads/${userData.userId.profilePicture}`)) {
        doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });
        doc.moveDown(); // Add some space after the image
    }

    // 2. Add Content with better spacing
    doc.fontSize(20).text("RESUME", { align: "center" });
    doc.moveDown();
    
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.text(`Username: ${userData.userId.username}`);
    doc.text(`Email: ${userData.userId.email}`);
    doc.moveDown();
    
    doc.fontSize(16).text("Bio:", { underline: true });
    doc.fontSize(12).text(userData.bio || "No bio provided.");
    doc.moveDown();

    doc.fontSize(16).text("Current Position:", { underline: true });
    doc.fontSize(12).text(userData.currentPost || "Not specified");
    doc.moveDown();

    doc.fontSize(16).text("Past Work / Experience:", { underline: true });
    if (userData.pastWork) {
        doc.fontSize(12).text(userData.pastWork);
    } else {
        doc.fontSize(12).text("No experience listed.");
    }

    doc.end();
    return outputPath;
};

export const register=async(req,res)=>{
    try{
           const {name,email,password,username}=req.body;
           console.log(req.body);

           if(!name || !email || !password || !username)return res.status(400).json({message:"All fields are required"});
           const user=await User.findOne({
                email
           });

           if(user) return res.status(400).json({message: "User already exists"});


            const hashedPassword=await bcrypt.hash(password,10);
            const newUser=new User({
                name,
                email,
                password:hashedPassword,
                username
            });


            await newUser.save();

            const profile=new Profile({userId:newUser._id,bio:"",education:"",pastWork:""});
            await profile.save(); 
return res.json({message:"User created"})

    }catch(error){
        return res.status(500).json({message: error.message});
    }
}



export const login=async(req,res)=>{
  try{
     const {email,password}=req.body;
     
     if(!email || !password) return res.status(400).json({message:"All fields are required"});


        const user=await User.findOne({
            email
        });

     if(!user) return res.status(404).json({message:"Use does not exist"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"});

            const token=crypto.randomBytes(32).toString("hex");


           await User.updateOne({_id:user._id},{token});
           return res.json({token})
  }catch(error){
  return res.status(500).json({message: error.message});
  }
}


export const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.token = "";
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const uploadProfilePicture=async(req,res)=>{
    const {token}=req.body;
    try{

        const user=await User.findOne({ token:token});

        if(!user){
            return res.status(404).json({message:"user not found"})
        }
          
        user.profilePicture=req.file.filename;

        await user.save();

         return res.json({message:"Profile Picture Updated"})


    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


//This updates the User model (name, username, email).
export const updateUserProfile=async(req,res)=>{
    try{
       const{token,...newUserData}=req.body;

       const user=await User.findOne({token:token});

       if(!user){
        return res.status(404).json({message:"user not found"})
       }
       const {username,email}=newUserData;


       const existingUser=await User.findOne({ $or: [{ username }, { email }]});

        
       if (existingUser && String(existingUser._id) !== String(user._id)) {
  return res.status(400).json({ message: "User already exists" });
}

       Object.assign(user,newUserData);
       await user.save();

       return res.json({message:"UserUpdated"})

    }catch(error){
         return res.status(500).json({message:error.message});
    }
}


export const getUserAndprofile=async(req,res)=>{
    try{
        const {token} = req.query;
        const user=await User.findOne({token:token});

         
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const userProfile=await Profile.findOne({userId:user._id})
            .populate('userId','name email username profilePicture');

        return res.json({"profile":userProfile})

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { q = "", token } = req.query;
        const trimmed = q.trim();

        if (trimmed.length < 2) {
            return res.status(400).json({ message: "Search query must be at least 2 characters" });
        }

        const regex = new RegExp(trimmed, "i");
        const searchFilter = {
            $or: [{ name: regex }, { username: regex }, { email: regex }],
        };

        const users = await User.find(searchFilter)
            .select("_id name username email profilePicture")
            .limit(20);

        let currentUserId = null;
        if (token) {
            const currentUser = await User.findOne({ token }).select("_id");
            currentUserId = currentUser?._id?.toString() || null;
        }

        const filteredUsers = users.filter((user) => user._id.toString() !== currentUserId);

        return res.json({ users: filteredUsers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "User id is required" });
        }

        const userProfile = await Profile.findOne({ userId: id })
            .populate("userId", "name email username profilePicture");

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.json({ profile: userProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//This updates the Profile model (bio, education, pastWork).
export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the profile
        const profile_to_update = await Profile.findOne({ userId: user._id });

        if (!profile_to_update) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Update the fields
        profile_to_update.bio = newProfileData.bio || profile_to_update.bio;
        profile_to_update.education = newProfileData.education || profile_to_update.education;
        
        // IMPORTANT: If your model expects an array for pastWork, 
        // and you're sending a string, we should handle it.
        profile_to_update.pastWork = newProfileData.pastWork; 

        await profile_to_update.save();
        
        return res.status(200).json({ message: "Profile updated successfully" });

    } catch (error) {
        console.error("SERVER ERROR:", error); // This shows in your terminal/cmd
        return res.status(500).json({ message: error.message });
    }
}


export const getAllUserProfile = async(req,res)=>{
    try{
        const profiles=await Profile.find().populate('userId', 'name username email profilePicture');

        return res.json({profiles})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


export const downloadProfile = async(req,res)=>{
    const user_id=req.query.id;

   const userProfile=await Profile.findOne({userId:user_id})
    .populate('userId','name username email profilePicture');

    let outputPath = await convertUserDataToPDF(userProfile);


    return res.json({ "message" : outputPath})
}



export const sendConnectionRequest = async(req,res)=>{
    const {token,connectionId} = req.body;


    try{

        const user = await User.findOne({token});


        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const connectionUser=await User.findOne({_id:connectionId});

       if(!connectionUser){
        return res.status(404).json({message: "Connection User not found"});
       }

       const existingRequest=await ConnectionRequest.findOne({
        userId:user._id,
        connectionId:connectionUser._id
       });


       if(existingRequest){
       return res.status(200).json({message:"Request alrady sent"})
       }

       const request=new ConnectionRequest({
        userId:user._id,
        connectionId:connectionUser._id
       });


       await request.save();
        return res.status(200).json({message:"Request sent"})
    }catch(err){
        return res.status(500).json({message:err.message})

    }
}


export const getMyConnectionRequests=async(req,res)=>{
    const {token} = req.query;
    try{
        const user=await User.findOne({token});

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const connections = await ConnectionRequest.find({userId:user._id})
            .populate('connectionId','name username email profilePicture');   

        return res.json({connections})
    
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const whatAreMyConnections=async(req,res)=>{
       const {token}=req.query;


       try{
        const user = await User.findOne({token});


        if(!user){
            return res.status(404).json({message:"User not found"})
        }


        const connections=await ConnectionRequest.find({connectionId:user._id})
            .populate('userId','name username email profilePicture');   


       return res.json(connections);
       }catch(err){

        return res.status(500).json({message:err.message})
       }
}




export const acceptConnectionRequest=async(req,res)=>{
    const {token,requestId,action_type}=req.body;

    try{
        const user=await User.findOne({token});

           if(!user){
            return res.status(404).json({message:"User not found"})
        }


        const connection=await ConnectionRequest.findOne({_id:requestId});

        if(!connection){
            return res.status(404).json({message:"Connection not found"})
        }

        if(action_type === "accept"){
            connection.status_accepted=true;
        }else{
            connection.status_accepted=false;
        }



        await connection.save();
        return res.json({message:"Request Updated"});

    }catch(err){
         return res.status(500).json({message:err.message});
    }
}


export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;

    try {
        const user = await User.findOne({ token: token }).select("_id");
        if (!user) return res.status(404).json({ message: "User not found" });

        // FIX: Renamed variable to 'targetPost' to avoid conflict with 'Post' model
        const targetPost = await Post.findOne({ _id: post_id });

        if (!targetPost) return res.status(404).json({ message: "Post not found" });

        const newComment = new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody
        });

        await newComment.save();
        return res.status(200).json({ message: "Comment Added" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};