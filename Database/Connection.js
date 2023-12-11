import mongoose from "mongoose";
const connectDB= async()=>{
    return await mongoose.connect(process.env.DATABASE).
    then(()=>{
        console.log('Connected Database Successfully');
    }).
    catch((error)=>{
        console.log(`Error occurred while connection with Database. ${error}`)
    })
}
export default connectDB;