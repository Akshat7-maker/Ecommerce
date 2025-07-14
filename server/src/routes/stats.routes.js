import { Router } from "express";
import allStatsControllers from "../controllers/stats.controller.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();


router.use(verifyUser)
router.use(isAdmin)

router.route("/get-all-stats").get( allStatsControllers.getDashboardStats);
router.route("/get-pie-chart-data").get( allStatsControllers.getPieChart);

export default router