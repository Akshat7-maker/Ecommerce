// import dotenv from "dotenv";
import "dotenv/config";
import app from "./app.js";
import connectDB from "./database/db.js";

// dotenv.config({ path: "./.env" });
const PORT =  process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => console.log("MONGO DB connection failed !!!", err));