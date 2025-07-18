import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
    async(_, thunkAPI) => {
  try{
    const response = await clientServer.get("/posts")
    return thunkAPI.fulfillWithValue(response.data);
    } catch(error) {
  return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to fetch posts" });
}

}
);





export const createPost = createAsyncThunk(
  "post/createPost",
  async (postData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post("/create_post", {
        ...postData,
        token
      });
      return thunkAPI.fulfillWithValue(response.data.post);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Post creation failed" });
    }
  }
);



export const likePost = createAsyncThunk(
  "post/likePost",
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post("/like_post", { postId, token });
      return thunkAPI.fulfillWithValue({ postId, likes: response.data.likes });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Like failed" });
    }
  }
);


export const commentPost = createAsyncThunk(
  "post/commentPost",
  async ({ postId, comment }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post("/comment_post", { postId, comment, token });
      return thunkAPI.fulfillWithValue({ postId, comments: response.data.comments });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Comment failed" });
    }
  }
);