import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser=createAsyncThunk(
    "user/login",
    async(user,thunkAPI)=>{
        try{
         const response=await clientServer.post("/login",{
            email:user.email, 
            password:user.password
         });

         if(response.data.token){
            localStorage.setItem("token",response.data.token)
         }else{
            return thunkAPI.rejectWithValue({
                message:"token not provided"}) 
         }


         return thunkAPI.fulfillWithValue(response.data.token)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data) 
        }
    }
)
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name
      });

     // ✅ After registering, immediately log in
      await thunkAPI.dispatch(loginUser({ email: user.email, password: user.password }));

      return thunkAPI.fulfillWithValue({
        message: response.data.message,
      });
    
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_user_and_profile", {
                params:{
                    token: user.token
                }
            })
            
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data||error.message);
        }
    }
);



export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post("/update_profile", {
        ...profileData,
        token
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Profile update failed" });
    }
  }
);


export const searchUsers = createAsyncThunk(
  "user/searchUsers",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.get("/search_users", {
        params: { query, token }
      });
      return thunkAPI.fulfillWithValue(response.data.users);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Search failed" });
    }
  }
);


export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post("/send_connection_request", {
        userId,
        token
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Request failed" });
    }
  }
);


export const respondConnectionRequest = createAsyncThunk(
  "user/respondConnectionRequest",
  async ({ requestId, action }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post("/respond_connection_request", {
        requestId,
        action, // "accept", "reject", "ignore"
        token
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Response failed" });
    }
  }
);

