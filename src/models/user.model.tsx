import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: String,
        userName: String,
        password: String,
        role: String,
    },
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;