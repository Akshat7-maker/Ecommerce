import { Router } from "express";
import verifyUser  from "../middlewares/auth.middlewares.js";
import allCartContoller from "../controllers/cart.controller.js";

const router = Router();

router.use(verifyUser)


router.route("/get-cart").get( allCartContoller.getCart)
router.route("/add-to-cart").post( allCartContoller.addToCart)
router.route("/delete-from-cart/:productId").delete( allCartContoller.deleteFromCart)
router.route("/remove-from-cart/:productId").patch( allCartContoller.removeFromCart)
router.route("/reset-cart").delete( allCartContoller.resetCart)


export default router 