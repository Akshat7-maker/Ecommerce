import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number, 
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    paymentInfo: {
      payment_id: {
        type: String,
        required: true,
      },
      order_id: {
        type: String,
        required: true,
      },
      signature: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["online", "cod"],
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    orderDeliveryStatus: {
      type: String,
      required: true,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    deleveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);

