import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Review } from "../models/review.model.js";

// create product
const createProduct = asyncHandler(async (req, res, next) => {
  // my way ***
  // const {name, price, description, category, stock} = req.body;
  // // console.log(name, price, description, category, stock);
  // // console.log(req.files);

  // if(!name || !price || !description || !category || !stock) {
  //     throw new ApiError(400, "Please fill all the fields")
  // }
  // // local path of images
  // const coverPicLocalPath = req.files?.coverPic[0]?.path;

  // let backPicLocalPath;
  // let sidePicLocalPath;
  // let otherPicsLocalPath;

  // let otherPicsCloudinaryPath;
  // let otherPics
  // if(req.files &&
  //     Array.isArray(req.files.backPic) &&
  //     req.files.backPic.length > 0
  // ){
  //     backPicLocalPath = req.files.backPic[0].path;
  // }

  // if(req.files &&
  //     Array.isArray(req.files.sidePic) &&
  //     req.files.sidePic.length > 0
  // ){
  //     sidePicLocalPath = req.files.sidePic[0].path;
  // }

  // if(req.files &&
  //     Array.isArray(req.files.otherPics) &&
  //     req.files.otherPics.length > 0
  // ){

  //     if(req.files.otherPics.length > 4) {
  //         throw new ApiError(400, "You can upload maximum 4 images")
  //     }

  //     if(req.files.otherPics.length == 1) {
  //         otherPicsLocalPath = req.files.otherPics[0].path;
  //          otherPicsCloudinaryPath = await uploadOnCloudinary(otherPicsLocalPath );

  //     }else {
  //         // console.log(req.files.otherPics);
  //         const otherPicsArr = req.files.otherPics;
  //         otherPicsLocalPath = otherPicsArr.map(pic => pic.path);
  //         // console.log(otherPicsLocalPath);
  //         const uploadPromises = otherPicsLocalPath.map(pic => uploadOnCloudinary(pic));
  //         otherPicsCloudinaryPath = await Promise.all(uploadPromises);
  //         console.log("ccccccccc",otherPicsCloudinaryPath);
  //         otherPics = otherPicsCloudinaryPath.map(pic => pic.url);
  //     }
  // }

  // if(!coverPicLocalPath) {
  //     throw new ApiError(400, "Please add a cover image")
  // }
  // // images will be uploaded on cloudinary

  // const coverPicCloudinaryPath = await uploadOnCloudinary(coverPicLocalPath);
  // const backPicCloudinaryPath = await uploadOnCloudinary(backPicLocalPath);
  // const sidePicCloudinaryPath = await uploadOnCloudinary(sidePicLocalPath );

  // const product = await Product.create({
  //     owner: req.user?._id || null,
  //     name,
  //     images: {
  //        coverPic: coverPicCloudinaryPath.url,
  //        backPic: backPicCloudinaryPath?.url,
  //        sidePic: sidePicCloudinaryPath?.url,
  //        otherPics
  //     },
  //     price,
  //     description,
  //     category,
  //     stock
  // });

  // return res
  // .status(201)
  // .json(new ApiResponse(201, product, "Product created successfully"))

  // better way

  const { name, price, description, category, stock } = req.body;

  if (!name || !price || !description || !category || !stock) {
    throw new ApiError(400, "Please fill all the fields");
  }

  // Local paths of images from the request
  const coverPicLocalPath = req.files?.coverPic?.[0]?.path;
  const backPicLocalPath = req.files?.backPic?.[0]?.path;
  const sidePicLocalPath = req.files?.sidePic?.[0]?.path;
  const otherPicsLocalPath = req.files?.otherPics?.map((pic) => pic.path) || [];

  if (!coverPicLocalPath) {
    throw new ApiError(400, "Please add a cover image");
  }

  if (otherPicsLocalPath.length > 4) {
    throw new ApiError(400, "You can upload maximum 4 images");
  }

  // Upload images to Cloudinary, handling only if path exists
  const [coverPic, backPic, sidePic, otherPics] = await Promise.all([
    uploadOnCloudinary(coverPicLocalPath),
    backPicLocalPath ? uploadOnCloudinary(backPicLocalPath) : null,
    sidePicLocalPath ? uploadOnCloudinary(sidePicLocalPath) : null,
    otherPicsLocalPath.length > 0
      ? Promise.all(otherPicsLocalPath.map((pic) => uploadOnCloudinary(pic)))
      : [],
  ]);

  const product = await Product.create({
    owner: req.user?._id || null,
    name,
    images: {
      coverPic: coverPic.url,
      backPic: backPic?.url,
      sidePic: sidePic?.url,
      otherPics: otherPics.map((pic) => pic.url),
    },
    price,
    description,
    category,
    stock,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// get all products
const getAllProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const totalProducts = await Product.countDocuments({});

  // const products = await Product.find({})
  //   .skip((page - 1) * limit)
  //   .limit(limit);

  const products = await Product.aggregate([
    // Step 1: Skip products for pagination
    { $skip: (page - 1) * limit },

    // Step 2: Limit the number of products per page
    { $limit: limit },

    // Step 3: Lookup reviews for each product
    {
      $lookup: {
        from: "reviews", // The collection to join (should match the actual MongoDB collection name)
        localField: "_id", // The field in the `Product` model
        foreignField: "product", // The field in the `Review` model
        as: "reviews", // The name of the resulting array
      },
    },

    // Step 4: Add reviewCount and avgRating fields
    {
      $addFields: {
        reviewCount: { $size: "$reviews" }, // Count of reviews
        avgRating: {
          $cond: [
            { $eq: [{ $size: "$reviews" }, 0] }, // Check if there are no reviews
            0, // If no reviews, avgRating is 0
            { $avg: "$reviews.rating" }, // Calculate the average rating
          ],
        },
      },
    },

    // Step 5: Project only the necessary fields
    {
      $project: {
        reviews: 0, // Exclude the reviews array if not needed
      },
    },
  ]);

  const modifiedProductsData = {
    productsShowing:
      limit * page > totalProducts ? totalProducts : limit * page,
    products,
    totalProducts,
    limit,
    page,
    totalPages: Math.ceil(totalProducts / limit),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        modifiedProductsData,
        "Products fetched successfully"
      )
    );
});

// filter products on basis of price
// const filterProducts = asyncHandler(async (req, res, next) => {
//   // console.log(req.query);
  
//   // const pricesort = req.query.pricesort;
//   // // console.log(pricesort);
  
  

//   // const page = parseInt(req.query.page) || 1;
//   // const limit = parseInt(req.query.limit) || 5;

//   const {pricesort, page= 1, limit = 5, category} = req.query

  
//   const totalProducts = await Product.countDocuments({});
//   let products;
  
//   if(category){

//     const totalProductsEachCategory = await Product.countDocuments({category});

//     products = await Product.find({category})
//       .skip((page - 1) * limit)
//       .limit(limit)
    
//     if(pricesort === "asc"){
//       products = await Product.find({category})
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ price: 1 });
//     } 

//     if(pricesort === "desc"){
//       products = await Product.find({category})
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ price: -1 });
//     }

//     const modifiedProductsData = {
//       productsShowing: limit * page > totalProductsEachCategory ? totalProductsEachCategory : limit * page,
//       products,
//       totalProductsEachCategory,
//       limit,
//       page,
//       totalPages: Math.ceil(totalProductsEachCategory / limit),
//     };

//     return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         modifiedProductsData,
//         "Products fetched successfully"
//       )
//     );

//   }


//   if (pricesort === "asc") {
//     products = await Product.find({})
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ price: 1 });
//   }

//   if (pricesort === "desc") {
//     products = await Product.find({})
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ price: -1 });
//   }

//   const modifiedProductsData = {
//     productsShowing: limit * page > totalProducts ? totalProducts : limit * page,
//     products,
//     totalProducts,
//     limit,
//     page,
//     totalPages: Math.ceil(totalProducts / limit),
//   };

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         modifiedProductsData,
//         "Products fetched successfully"
//       )
//     );
// });


const filterProducts = asyncHandler(async (req, res, next) => {
  const { pricesort, page = 1, limit = 5, category } = req.query;

  console.log(pricesort, page, limit, category)

  // Initialize the query and sort options
  const query = category? { category } : {};
  const sort = pricesort === "asc" ? { price: 1 } : pricesort === "desc" ? { price: -1 } : {};

  // count the total number of products
  const totalProducts = await Product.countDocuments(query);

  //  Fetch products with pagination and sorting
  const products = await Product.aggregate([
    // Step 1: Apply the filter query
    { $match: query },

    // Step 2: Skip products for pagination
    { $skip: (page - 1) * limit },

    // Step 3: Limit the number of products per page
    { $limit: parseInt(limit) },

    // Step 4: Sort products by price (if sorting is applied)
    { $sort: sort },

    // Step 5: Lookup reviews for each product
    {
      $lookup: {
        from: "reviews", // The collection to join (should match the actual MongoDB collection name)
        localField: "_id", // The field in the `Product` model
        foreignField: "product", // The field in the `Review` model
        as: "reviews", // The name of the resulting array
      },
    },

    // Step 6: Add reviewCount and avgRating fields
    {
      $addFields: {
        reviewCount: { $size: "$reviews" }, // Count of reviews
        avgRating: {
          $cond: [
            { $eq: [{ $size: "$reviews" }, 0] }, // Check if there are no reviews
            0, // If no reviews, avgRating is 0
            { $avg: "$reviews.rating" }, // Calculate the average rating
          ],
        },
      },
    },

    // Step 7: Project only the necessary fields
    {
      $project: {
        reviews: 0, // Exclude the reviews array if not needed
      },
    },
  ]);
  

    // create response data

    const modifiedProductsData = {
      productsShowing: limit * page > totalProducts ? totalProducts : limit * page,
      products,
      totalProducts,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          modifiedProductsData,
          "Products fetched successfully"
        )
      )


})

// get latest products
const getLatestProducts = asyncHandler(async (req, res, next) => {
  // const products = await Product.find({})
  // .sort({ createdAt: -1 })
  // .limit(4);

  const products = await Product.aggregate([
    // Step 1: Sort products by creation date (newest first)
    { $sort: { createdAt: -1 } },

    // Step 2: Limit to the latest 4 products
    { $limit: 4 },

    // Step 3: Lookup reviews for each product
    {
      $lookup: {
        from: "reviews", // The collection to join (should match the actual MongoDB collection name)
        localField: "_id", // The field in the `Product` model
        foreignField: "product", // The field in the `Review` model
        as: "reviews", // The name of the resulting array
      },
    },

    // Step 4: Add reviewCount and avgRating fields
    {
      $addFields: {
        reviewCount: { $size: "$reviews" }, // Count of reviews
        avgRating: {
          $cond: [
            { $eq: [{ $size: "$reviews" }, 0] }, // Check if there are no reviews
            0, // If no reviews, avgRating is 0
            { $avg: "$reviews.rating" }, // Calculate the average rating
          ],
        },
      },
    },

    // Step 5: Project only the necessary fields
    {
      $project: {
        reviews: 0, // Exclude the reviews array if not needed
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// get admin products
const getAdminProducts = asyncHandler(async (req, res, next) => {
  // const products = await Product.find({ owner: req.user._id });
  const products = await Product.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// get unique categories
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Product.distinct("category");
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// get detail of single product by id
const getSingleProductDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Please provide a product id");
  }
  // we can make a lean query when we don't want to get the stock and make a query faster
  // lean is useful when we want to display the data to the user and it is faster
  // without lean we get Mongoose document with extra methods
  // with lean we get Plain JavaScript object without Mongoose methods
  const product = await Product.findById(id);
  // .select("-stock")
  // .lean()
  // .populate("owner", "_id name");
  // console.log("product",product);
  // const myProduct = await Product.findById(id).lean();
  // console.log("myProduct",myProduct);

  // if (!product) {
  //   throw new ApiError(404, "Product not found");
  // }

  // const owner = await User.findById(product.owner);

  // if (!owner) {
  //   throw new ApiError(404, "Owner not found");
  // }

  // approach 1 using object spread and toObject()
  // const productWithOwner = {
  //     ...product.toObject(),
  //     owner: {
  //         _id: owner._id,
  //         name: owner.name
  //     }
  // };

  // console.log("productWithOwner",productWithOwner);

  // approach 2 using populate
  // await product.populate("owner", "_id name");

  // approach 3 using lean()
  // faster

  // approach 4 using aggregation pipeline
  // const productWithOwner = await Product.aggregate([
  //     {$match: {_id: new mongoose.Types.ObjectId(id)}},
  //     {$lookup: {
  //         from: "users",
  //         localField: "owner",
  //         foreignField: "_id",
  //         as: "owner"
  //     }},
  //     {$unwind: "$owner"},
  //     {$project: {
  //         name: 1,
  //         price: 1,
  //         description: 1,
  //         category: 1,
  //         owner: {
  //             _id: "$owner._id",
  //             name: "$owner.name"
  //         }
  //     }}

  // ]);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// update product info by id
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, description, category, stock } = req.body;
  // console.log(id);
  // console.log(name, price, description, category, stock);

  if (!id) {
    throw new ApiError(400, "Please provide a product id");
  }

  if (
    [name, description, category].every((field) => !field?.trim()) &&
    [price, stock].every((field) => !field)
  ) {
    throw new ApiError(
      400,
      "Please enter atleast one field you want to update"
    );
  }

  // check if product exists
  const productexist = await Product.findById(id);
  if (!productexist) {
    throw new ApiError(404, "Product not found");
  }

  const updateFields = {};
  if (name?.trim()) updateFields.name = name.trim();
  if (price !== undefined && price !== null) updateFields.price = price;
  if (description?.trim()) updateFields.description = description.trim();
  if (category?.trim()) updateFields.category = category.trim();
  if (stock !== undefined && stock !== null) updateFields.stock = stock;
  //   const product = await Product.findByIdAndUpdate(
  //     id,
  //     {
  //       $set: {
  //         name: name ? name.trim() : undefined,
  //         price: price ? price : undefined,
  //         description: description ? description.trim() : undefined,
  //         category: category ? category.trim() : undefined,
  //         stock: stock ? stock : undefined,
  //       },
  //     },
  //     { new: true }
  //   );

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  //   the updateFields approach is just a bit more elegant
  //    and avoids sending unnecessary undefined updates,
  //    while the logic remains the same. However, if your
  //    code works and feels readable as it is, you can
  //    absolutely continue with your current setup.

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const allProductControllers = {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getCategories,
  getSingleProductDetails,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  filterProducts,
};

export default allProductControllers;
