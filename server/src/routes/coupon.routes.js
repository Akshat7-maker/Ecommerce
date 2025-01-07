import Router from "express";
import allCouponControllers from "../controllers/coupon.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/create-coupon").post(verifyUser, isAdmin, allCouponControllers.createCoupon);
router.route("/get-all-coupons").get(verifyUser, isAdmin, allCouponControllers.getAllCoupons);
router.route("/get-coupon/:couponId").get(allCouponControllers.getCoupon);
router.route("/update-coupon/:couponId").patch(verifyUser, isAdmin, allCouponControllers.updateCoupon);
router.route("/delete-coupon/:couponId").delete(verifyUser, isAdmin, allCouponControllers.deleteCoupon);

export default router

