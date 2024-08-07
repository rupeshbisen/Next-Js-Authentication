
import connectToDB from "@/database";
import OtpStore from "@/models/otp.model";
import User from "@/models/user.model";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
    userName: Joi.string().email().required(),
    password: Joi.string().required(),
    otp: Joi.number().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    await connectToDB();
    const { userName, password, otp } = await req.json();

    const { error } = schema.validate({ userName, password, otp });

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
        });
    }

    try {
        const storedOtp = await OtpStore.findOne({ userName });
        const now = new Date();
        const createdAtDate = new Date(storedOtp.createdAt);

        // Calculate the difference in minutes
        const diffInMinutes = (now.getTime() - createdAtDate.getTime()) / (1000 * 60);

        if (diffInMinutes > 10) {
            await OtpStore.deleteOne({ userName });// Optionally delete expired OTP
            return NextResponse.json({
                success: false,
                status: 400,
                message: 'OTP has expired.',
            })
        }

        if (storedOtp.otp === otp) {
            await OtpStore.deleteOne({ userName }); // Delete OTP after successful verification
            const hashPassword = await hash(password, 12);
            const passwordUpdated = await User.findOneAndUpdate({ userName }, { userName, password: hashPassword }, { new: true });
            if (passwordUpdated) {
                return NextResponse.json({
                    success: true,
                    status: 200,
                    message: 'Password updated successfully.',
                })
            }
        } else {
            return NextResponse.json({
                success: false,
                status: 400,
                message: 'Invalid OTP.',
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            status: 500,
            message: 'Failed to change Password. Please try again.',
        });
    }
}