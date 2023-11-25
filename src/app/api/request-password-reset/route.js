import connectToDB from "@/database";
import User from "@/models/user";
import Token from "@/models/token";
import { compare, hash } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sendEmail from "../../../utils/sendEmail"; // Update the path as needed

const bcryptSalt = 10;
const clientURL = "localhost:3000"; // Replace with your actual client URL

const schema = Joi.object({
  email: Joi.string().email().required(),
});

export async function POST(req) {
  await connectToDB();

  const { email } = await req.json();

  const { error } = schema.validate({ email });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Account not found with this email.",
      });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token and save it to the Token collection
    const hashedToken = await hash(resetToken, bcryptSalt);
    await Token.findOneAndDelete({ userId: user._id });
    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
    }).save();

    // Construct the password reset link
    // const encodedToken = encodeURIComponent(resetToken);
    // const encodedId = encodeURIComponent(user._id);
    const link = `${clientURL}/reset-password?token=${resetToken}&id=${user._id}`;
    // 

    // Send the password reset email
    await sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.name, link },
      "requestResetPassword.handlebars"
    );
    return NextResponse.json({
      success: true,
      message: "Email Verified. Password resent link sent to email",
    });
  } catch (error) {
    console.error("Error while verifying email. Please try again.", error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}