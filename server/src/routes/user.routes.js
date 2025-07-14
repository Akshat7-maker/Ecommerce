import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import allUserControllers from "../controllers/user.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/register").post(upload.single("coverPic"), allUserControllers.registerUser);
router.route("/login").post(allUserControllers.loginUser);

router.use(verifyUser)
router.route("/edit-profile").put( upload.single("coverPic"),  allUserControllers.editProfile);
router.route("/get-all-users").get( isAdmin, allUserControllers.getAllUsers);

router.route("/logout").post( allUserControllers.logoutUser);
router.route("/change-admin").patch(verifyUser, allUserControllers.changeAdmin);

export default router