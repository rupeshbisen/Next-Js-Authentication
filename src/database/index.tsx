import mongoose from "mongoose";

const DB_NAME = "Authetication"
const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Database connected successfully !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Getting Error from DB connection", error);
        process.exit(1)
    }
}
export default connectToDB