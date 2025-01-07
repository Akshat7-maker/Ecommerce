import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { calculatePercentage } from "../utils/features.js";

// const today = new Date();
// console.log(today.toLocaleString());

// const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
// console.log(startOfMonth.toLocaleString());

// const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
// console.log(endOfMonth.toLocaleString());

const getDashboardStats = asyncHandler(async (req, res, next) => {
  const today = new Date();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const thisMonth = {
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: today,
  };

  const lastMonth = {
    start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
    end: new Date(today.getFullYear(), today.getMonth(), 0),
  };

  //   products
  const thisMonthProductsPromise = Product.find({
    createdAt: {
      $gte: thisMonth.start,
      $lte: thisMonth.end,
    },
  });

  const lastMonthProductsPromise = Product.find({
    createdAt: {
      $gte: lastMonth.start,
      $lte: lastMonth.end,
    },
  });

  //   users
  const thisMonthUsersPromise = User.find({
    createdAt: {
      $gte: thisMonth.start,
      $lte: thisMonth.end,
    },
  });

  const lastMonthUsersPromise = User.find({
    createdAt: {
      $gte: lastMonth.start,
      $lte: lastMonth.end,
    },
  });

  //   orders
  const thisMonthOrdersPromise = Order.find({
    createdAt: {
      $gte: thisMonth.start,
      $lte: thisMonth.end,
    },
  });
  const lastMonthOrdersPromise = Order.find({
    createdAt: {
      $gte: lastMonth.start,
      $lte: lastMonth.end,
    },
  });

  const lastSixMonthOrdersPromise = Order.find({
    createdAt: {
      $gte: sixMonthsAgo,
      $lte: today,
    },
  });

  const latestTransactionsPromise = Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("orderItems totalAmount paymentStatus orderDeliveryStatus");

  const [
    thisMonthProducts,
    lastMonthProducts,
    thisMonthUsers,
    lastMonthUsers,
    thisMonthOrders,
    lastMonthOrders,
    totalProducts,
    totalUsers,
    totalOrders,
    lastSixMonthOrders,
    categories,
    totalMales,
    latestTransactions
  ] = await Promise.all([
    thisMonthProductsPromise,
    lastMonthProductsPromise,
    thisMonthUsersPromise,
    lastMonthUsersPromise,
    thisMonthOrdersPromise,
    lastMonthOrdersPromise,
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({}).select("totalAmount"),
    lastSixMonthOrdersPromise,
    Product.distinct("category"),
    User.countDocuments({gender: "male"}),
    latestTransactionsPromise
  ]);

  // revenue
  const thisMonthRevenue = thisMonthOrders.reduce((total, order) => {
    return total + order.totalAmount;
  }, 0);

  const lastMonthRevenue = lastMonthOrders.reduce((total, order) => {
    return total + order.totalAmount;
  }, 0);

  const changePercentage = {
    revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
    product: calculatePercentage(
      thisMonthProducts.length,
      lastMonthProducts.length
    ),
    user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
    order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
  };

  // total Revenue
  const totalRevenue = totalOrders.reduce((total, order) => {
    return total + order.totalAmount;
  }, 0);

  const orderMonthCount = new Array(6).fill(0);
  const orderMonthlyRevenue = new Array(6).fill(0);

  lastSixMonthOrders.forEach((order) => {
    const creationDate = order.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if(monthDiff >= 0 && monthDiff < 6) {
      orderMonthCount[5 - monthDiff] += 1;
      orderMonthlyRevenue[5 - monthDiff] += order.totalAmount
    }
  })

  const categoryCountPromise = categories.map((category) => Product.countDocuments({category}))

  const categoryCount = await Promise.all(categoryCountPromise)

  const modifiedCategoryFormmat = []

  categories.forEach((category, index) => {
    modifiedCategoryFormmat.push({
      [category]: (categoryCount[index]/totalProducts)*100
    })
  })

  const genderRatio = {
    male: (totalMales/totalUsers)*100,
    female: 100 - (totalMales/totalUsers)*100
  }

  



  const count = {
    
    products: totalProducts,
    users: totalUsers,
    orders: totalOrders.length,
    revenue: totalRevenue,
  };

  const stats = {
    modifiedCategoryFormmat,
    latestTransactions,
    genderRatio,
    categories,
    changePercentage,
    count,
    chart:{
      order: orderMonthCount,
      revenue: orderMonthlyRevenue
    }
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Stats fetched successfully"));
});

const getPieChart = asyncHandler(async (req, res, next) => {

  const allOrderPromise = Order.find({})

  const [
    allOrder,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    canceledOrders,
    totalProducts,
    outOfStock,
    categories,


  ] = await Promise.all([
    allOrderPromise,
    Order.countDocuments({orderDeliveryStatus: "pending"}),
    Order.countDocuments({orderDeliveryStatus: "shipped"}),
    Order.countDocuments({orderDeliveryStatus: "delivered"}),
    Order.countDocuments({orderDeliveryStatus: "canceled"}),
    Product.countDocuments(),
    Product.countDocuments({stock: 0}),
    Product.distinct("category"),
    
  ]);

  const orderFullfillment = {
    pending: pendingOrders,
    shipped: shippedOrders,
    delivered: deliveredOrders,
    canceled: canceledOrders,
  }

  const stockAvailability = {
    inStock: totalProducts - outOfStock,
    outOfStock,
  }

  const categoryCountPromise = categories.map((category) => Product.countDocuments({category}))

  const categoryCount = await Promise.all(categoryCountPromise)

  const modifiedCategoryFormmat = []

  categories.forEach((category, index) => {
    modifiedCategoryFormmat.push({
      [category]: (categoryCount[index]/totalProducts)*100
    })
  })

  const grossIncome = allOrder.reduce((total, order) => {
    return total + order.totalAmount;
  },0)  

  const discount = allOrder.reduce((total, order) => {
    return total + order.discount || 0
  },0)

  const marketingCost = Math.round(grossIncome * 0.3)

  const netMargin = grossIncome - discount - marketingCost

  const revenueDistribution = {
    grossIncome,
    discount,
    marketingCost,
    netMargin
  }

  const charts = {
    orderFullfillment,
    stockAvailability,
    revenueDistribution,
    modifiedCategoryFormmat
  }

  return res
    .status(200)
    .json(new ApiResponse(200, charts, "Stats fetched successfully"));
});

const allStatsControllers = {
  getDashboardStats,
  getPieChart
};

export default allStatsControllers;
