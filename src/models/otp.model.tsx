import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
    {
        otp: Number,
        userName: String,
    },
    {
        timestamps: true
    }
);

const OtpStore = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);

export default OtpStore;