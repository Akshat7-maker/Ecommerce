import { Router } from "express";
import allProductControllers from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyUser from "../middlewares/auth.middlewares.js";
import isAdmin from "../middlewares/admin.middleware.js";


const router = Router();

// get all products
router.route("/get-all-products").get(allProductControllers.getAllProducts)

// get latest products
router.route("/get-latest-products").get(allProductControllers.getLatestProducts)

router.route("/get-filter-products").get(allProductControllers.filterProducts)

// only admin can create a product
router.route("/create-product").post(verifyUser, isAdmin, upload.fields([
    {
        name: "coverPic",
        maxCount: 1
    },
    {
        name: "backPic",
        maxCount: 1
    },
    {
        name: "sidePic",
        maxCount: 1
    },
    {
        name: "otherPics",
        maxCount: 4
    }
]),
allProductControllers.createProduct)

// to get all products of a admin 
router.route("/get-admin-products")
.get(verifyUser, isAdmin, allProductControllers.getAdminProducts)

//To get all unique Categories
router.route("/get-categories").get(allProductControllers.getCategories)


// To get, update, delete Product
router.route("/:id")
.get(allProductControllers.getSingleProductDetails)
.put(upload.single("coverPic"), allProductControllers.updateProduct)
.delete(allProductControllers.deleteProduct)


export default router