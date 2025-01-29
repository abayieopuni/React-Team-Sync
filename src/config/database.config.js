import mongoose from "mongoose";
import { config } from "./appConfig.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    console.log("connected to Database")
  } catch (error) {
    console.log("Error connecting to Mongo Database")
    process.exit(1)
  }
} 

