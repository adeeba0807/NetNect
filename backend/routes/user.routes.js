import {Router} from "express";
import { acceptConnectionRequest, downloadProfile, forgotPassword, getAllUserProfile, getMyConnectionRequests, getPublicProfile, getUserAndprofile, login,register,searchUsers,sendConnectionRequest,updateProfileData,updateUserProfile,uploadProfilePicture, whatAreMyConnections} from "../controllers/user.controller.js";

import multer from "multer";
import crypto from "crypto";
import path from "path";


const router=Router();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
});

const upload=multer({storage: storage});
    

router.route("/update_profile_picture")
    .post(upload.single('profile_picture'),uploadProfilePicture)


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot_password').post(forgotPassword);
router.route('/user_update').post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndprofile);
router.route("/search_users").get(searchUsers);
router.route("/public_profile").get(getPublicProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
export default router;