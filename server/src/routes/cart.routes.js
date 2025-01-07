import { Router } from "express";
import verifyUser  from "../middlewares/auth.middlewares.js";
import allCartContoller from "../controllers/cart.controller.js";

const router = Router();


router.route("/get-cart/:userId").get( allCartContoller.getCart)
router.route("/add-to-cart/:userId").post( allCartContoller.addToCart)
router.route("/delete-from-cart/:userId/:productId").delete( allCartContoller.deleteFromCart)
router.route("/remove-from-cart/:userId/:productId").patch( allCartContoller.removeFromCart)
router.route("/reset-cart/:userId").delete( allCartContoller.resetCart)


export default router 