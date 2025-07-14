import { Router } from "express";

import allReviewControllers from "../controllers/review.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();



router.route("/get-all-reviews/:productId")
.get(allReviewControllers.getAllReviews);

router.use(verifyUser)
router.route("/create-review/:productId")
.post( allReviewControllers.createReview);

router.route("/update-review/:reviewid")
.put( allReviewControllers.updateReview);

router.route("/get-review-of-user/:productId")
.get( allReviewControllers.getReviewOfUser);

router.route("/delete-review/:reviewid")
.delete( allReviewControllers.deleteReview);

export default router