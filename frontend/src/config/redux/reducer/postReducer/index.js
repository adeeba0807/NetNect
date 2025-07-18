import { createSlice } from "@reduxjs/toolkit";
import { commentPost, createPost, getAllPosts, likePost } from "../../action/postAction/index"; // Adjust path as needed

const { act } = require("react");

const initialState = {
    posts: [],
    isError:false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",    
    comments:[],
    postId:"",

}



const postSlice = createSlice({
    name: "post",  
    initialState,
    reducers: {
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.message="Fetching posts...";
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.postFetched = true;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload.message;
            })
            
// In your post reducer's extraReducers
.addCase(createPost.fulfilled, (state, action) => {
  state.posts.unshift(action.payload); // Add new post to the top
  state.message = "Post created successfully";
})
.addCase(createPost.rejected, (state, action) => {
  state.message = action.payload?.message || "Post creation failed";
})
// In your post reducer's extraReducers
.addCase(likePost.fulfilled, (state, action) => {
  const post = state.posts.find(p => p._id === action.payload.postId);
  if (post) post.likes = action.payload.likes;
})
.addCase(commentPost.fulfilled, (state, action) => {
  const post = state.posts.find(p => p._id === action.payload.postId);
  if (post) post.comments = action.payload.comments;
})



        }
}) 

export default postSlice.reducer;