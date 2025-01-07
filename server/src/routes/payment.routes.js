import { Router } from "express";
import allPaymentControllers from "../controllers/payment.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create-order").post(allPaymentControllers.createOrder);
router.route("/verify-payment").post(allPaymentControllers.paymentVerification);

export default router