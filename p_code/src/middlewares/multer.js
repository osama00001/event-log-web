import multer, {diskStorage} from "multer"
import path from "path"
import fs from "fs";

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
      },
      filename: function (req, file, cb) {
        
        cb(null, file.originalname)
      },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
})

export const upload = multer({storage})