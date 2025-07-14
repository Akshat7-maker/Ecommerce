import { Router } from "express";
import allOrderControllers from "../controllers/order.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();


router.use(verifyUser)


router.route("/create-order").post( allOrderControllers.createOrder);
router.route("/my-order").get( allOrderControllers.myOrder);
router.route("/get-order/:orderId").get( allOrderControllers.getOrderById);
router.route("/get-recent-orders").get( allOrderControllers.getRecentOrders);
router.route("/get-all-orders-of-admin").get(isAdmin, allOrderControllers.getAllOrdersOfAdmin);
router.route("/get-recent-orders-of-admin").get(isAdmin, allOrderControllers.getRecentOrdersOfAdmin);
// router.route("/update-order/:orderId").patch( allOrderControllers.updateOrder);
router.route("/delete-order/:orderId").delete(isAdmin, allOrderControllers.deleteOrder);
router.route("/process-order/:orderId").put(isAdmin, allOrderControllers.processOrder);


  
export default router