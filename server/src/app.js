import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true  // allows cookies to be sent
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import produtRouter from "./routes/product.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRouter from "./routes/cart.routes.js"
import couponRouter from "./routes/coupon.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import statsRouter from "./routes/stats.routes.js"


// route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", produtRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/stats", statsRouter);

export default app
