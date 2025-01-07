import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    images: {
      coverPic: {
        type: String,
        required: [true, "Please add a cover image"],
      },

      backPic: {
        type: String,
      },
      sidePic: {
        type: String,
      },
      otherPics: [
        {
          type: String,
        },
      ],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    stock: {
      type: Number,
      required: [true, "Please add a stock"],
    },
    numRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
