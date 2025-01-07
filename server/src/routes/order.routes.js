import { Router } from "express";
import allOrderControllers from "../controllers/order.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";

const router = Router();


router.route("/create-order").post( allOrderControllers.createOrder);
router.route("/my-order/:userId").get( allOrderControllers.myOrder);
router.route("/get-order/:orderId").get( allOrderControllers.getOrderById);
router.route("/get-all-orders-of-admin").get( allOrderControllers.getAllOrdersOfAdmin);
router.route("/get-recent-orders/:userId").get( allOrderControllers.getRecentOrders);
router.route("/get-recent-orders-of-admin").get( allOrderControllers.getRecentOrdersOfAdmin);
// router.route("/update-order/:orderId").patch( allOrderControllers.updateOrder);
router.route("/delete-order/:orderId").delete( allOrderControllers.deleteOrder);
router.route("/process-order/:orderId").put( allOrderControllers.processOrder);


  
export default router