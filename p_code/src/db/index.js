
import mongoose from "mongoose"
import dotenv from 'dotenv';

dotenv.config();

const connectdb = async()=>{
try{
 let dbConnect = await mongoose.connect(process.env.MONGO_URI)
 console.warn(`database: ${dbConnect.connections[0].name} is connected`)
}catch(e){
    console.error('MongoDB connection error:', e);
    process.exit(1);
}
}

export default connectdb