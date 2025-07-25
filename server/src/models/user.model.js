import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    gender:{
        type: String,
        required: [true, "Please add a gender"],
    },
    coverPic: {
        type: String,  // cloudinary url
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    refreshToken:{
        type: String
    }
},{
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User", userSchema);


// syntax of generate token
// const jwt = require('jsonwebtoken');

// // Define the payload (data to store in the token)
// const payload = {
//   userId: "123456",
//   role: "user"
// };

// // Define the secret key (should be kept secure)
// const secretKey = "your_secret_key";

// // Define the token expiration time
// const options = { expiresIn: '1h' }; // Token valid for 1 hour

// // Generate the token
// const token = jwt.sign(payload, secretKey, options);

// console.log("Generated JWT:", token);
