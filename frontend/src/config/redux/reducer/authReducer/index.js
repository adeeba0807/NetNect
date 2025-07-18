import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, respondConnectionRequest, sendConnectionRequest } from "../../action/authAction";
import { getAboutUser, updateUserProfile } from '../../action/authAction'; // ✅ Adjust path if needed
import { searchUsers} from '../../action/authAction'; // ✅ Adjust path if needed
const { connection } = require("next/server");

const initialState={
    user:[],
    isError:false,
    isSuccess:false,
    registered: false,
    isLoading:false,
    loggedIn:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    searchResults: [],
};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="hello"
        },
        emptyMessage:(state)=>{
            state.message=""
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true
            state.message="Knocking the door..."
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.token = action.payload.token;
  localStorage.setItem("token", action.payload.token);
            state.message="Login is Successful"


        })


        .addCase(loginUser.rejected,(state,action)=>{
              state.isLoading=false;
            state.isError=true;
        
            state.message=action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true
            state.message="Registering you..."
        })
     .addCase(registerUser.fulfilled, (state, action) => {
    state.isLoading = false;
    state.registered = true;
  state.isError = false;
  state.isSuccess = true;
  state.message = action.payload.message;
})

        .addCase(registerUser.rejected,(state,action)=>{
              state.isLoading=false;
            state.isError=true;
        
            state.message=action.payload
        })
         .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
            })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
            state.user = action.payload.profile.userId;    // user info: name, email, etc.
  state.profile = action.payload.profile;
        })
           .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
             .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.message = "Updating profile...";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.profile = action.payload.profile;
        state.user = action.payload.profile.userId;
        state.message = "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Profile update failed";
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.message = "Searching users...";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.searchResults = action.payload;
        state.message = "Search complete";
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Search failed";
      })
      // In extraReducers of your auth reducer
.addCase(sendConnectionRequest.fulfilled, (state, action) => {
  state.message = "Connection request sent!";
})
.addCase(sendConnectionRequest.rejected, (state, action) => {
  state.message = action.payload?.message || "Failed to send request";
})
.addCase(respondConnectionRequest.fulfilled, (state, action) => {
  state.message = "Request updated!";
  // Optionally update state.connectionRequest here
})
.addCase(respondConnectionRequest.rejected, (state, action) => {
  state.message = action.payload?.message || "Failed to update request";
})
    }
})
export const { reset, emptyMessage } = authSlice.actions;
export default authSlice.reducer