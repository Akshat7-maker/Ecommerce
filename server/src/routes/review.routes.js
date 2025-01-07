import { Router } from "express";

import allReviewControllers from "../controllers/review.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/create-review/:productId/:userId")
.post( allReviewControllers.createReview);

router.route("/get-all-reviews/:productId")
.get(allReviewControllers.getAllReviews);

router.route("/update-review/:reviewid/:userId")
.put( allReviewControllers.updateReview);

router.route("/get-review-of-user/:productId/:userId")
.get( allReviewControllers.getReviewOfUser);

router.route("/delete-review/:reviewid")
.delete( allReviewControllers.deleteReview);

export default router