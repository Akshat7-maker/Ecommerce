import Razorpay from "razorpay";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create order

const createOrder = asyncHandler(async (req, res, next) => {
  const { amount, currency } = req.body;
  console.log(amount, currency);

  if (!amount || !currency) {
    return res.status(400).json({
      success: false,
      message: "Please provide amount and currency",
    });
  }



  const options = {
    amount: amount * 100,
    currency,
  };

  const order = await razorpay.orders.create(options);
  // console.log(order);

  if (!order) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }

  return res.status(200).json({
    success: true,
    order,
  });
});


// payment verification
const paymentVerification = asyncHandler(async (req, res, next) => {
  console.log("paymentVerification");
  // console.log(req.body);
  const { payment_id, order_id, signature } = req.body;

  
  console.log(payment_id, order_id, signature);

  const body = order_id + "|" + payment_id;
  const expected_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");


    const isAuthenticated = expected_signature === signature;

    if (isAuthenticated) {
      console.log("payment verified");

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });


      // database come here



      // res.redirect(`http://localhost:3000/success?reference=${razorpay_payment_id}`);
    }else{
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  

  
})

const allPaymentControllers = {
  createOrder,
  paymentVerification
};

export default allPaymentControllers;
