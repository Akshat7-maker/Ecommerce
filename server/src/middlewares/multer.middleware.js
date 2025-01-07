import multer from "multer";

// setting up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },

    filename: (req, file, cb) => {
        // console.log("hello i am multer");
        // console.log(file);
        cb(null, Date.now() + "_" + file.originalname);
    },
})

export const upload = multer({storage})