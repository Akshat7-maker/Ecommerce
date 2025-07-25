import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        cartItems:[
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity:{
                    type: Number,
                    required:true,
                    min:1,
                    default:1
                },
                price:{
                    type: Number,
                    required:true
                }
            }
        ],

        totalAmount:{
            type: Number,
            required:true,
            default:0
        },

        totalQuantity:{
            type: Number,
            required:true,
            default:0
        }

    },
    {
        timestamps: true
    }
)

export const Cart = mongoose.model("Cart", cartSchema);