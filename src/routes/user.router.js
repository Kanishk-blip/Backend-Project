import { Router } from "express";
import { registerUser}  from "../controllers/user.controllers.js";
const router=Router()
router.route('/').get(registerUser)
export default router;