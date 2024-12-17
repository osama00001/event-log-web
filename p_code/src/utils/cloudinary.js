import { v2 as cloudinary } from 'cloudinary';
import { AppError } from './AppError.js';
import { promises as fs } from 'fs';

  cloudinary.config({
        cloud_name: "dr8pdvovs",
        api_key: "594559461284574",
        api_secret: 'QtDRPxgM66ADk83YlRaSZYtzTco',
  })

console.warn(process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET)


  const uploadfileToCloudinary= async(localFilePath)=>{
    try{
        if (!localFilePath)  throw new AppError("File path is missing",401)
        let response = await cloudinary.uploader
        .upload( localFilePath, { folder: "uploads",  resource_type: "auto" }
        )

        console.warn("File uploaded successfully", response.secure_url);
        return response

    }catch(err){
      console.warn(err)
        await fs.unlink(localFilePath);
        throw new AppError("something went wrong with cloudinary",500)
    }

  }

  export {uploadfileToCloudinary}