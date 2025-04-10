import { Router } from "express";
import { logoutuser, registerUser}  from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.js";
const router=Router()
router.route('/').post(
    upload.fields(
       [ {
            name: "avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }]
    ),
    registerUser)
router.route('/login').post(loginUser);
router.route('/logout').post(authmiddle.js,logoutuser)
export default router;