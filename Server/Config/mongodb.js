import mongoose from "mongoose";
const ConnectDB = async ()=>{
    mongoose.connection.on(`connected`,()=>{
        console.log(`Successful Connection DB `);
    })
    await mongoose.connect(process.env.MONGODB_URL)
}
export default ConnectDB;