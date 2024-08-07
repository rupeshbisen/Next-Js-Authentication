
import connectToDB from "@/database";
import { createTransport, TransportOptions } from "nodemailer";
import { NextResponse } from "next/server";
import Joi from "joi";
import OtpStore from "@/models/otp.model";
import User from "@/models/user.model";

const schema = Joi.object({
    userName: Joi.string().email().required(),
});

export const dynamic = "force-dynamic";


let transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_MAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
} as TransportOptions);


export async function POST(req: Request) {
    await connectToDB();

    const { userName } = await req.json();
    const { error } = schema.validate({ userName });

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
        });
    }

    try {
        const checkUser = await User.findOne({ userName })
        if (!checkUser) {
            return NextResponse.json({
                success: false,
                message: "Account not found with this userName",
            })
        }
        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: userName,
            subject: 'Your OTP Code',
            text: `Hello,
            Your OTP code is ${otp}. It is valid for 10 minutes.
            If you did not request this, please ignore this email.
            Thank you`,
            html: `<p>Hello,</p>
            <p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,<br/>The Team</p>`,
        };

        await transporter.sendMail(mailOptions);

        // Store OTP with expiration
        const OtpStored = await OtpStore.create({
            userName,
            otp,
        });

        if (OtpStored) {
            return NextResponse.json({
                success: true,
                message: 'OTP has been sent to your email.',
            })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to send OTP. Please try again.',
        });
    }

}

