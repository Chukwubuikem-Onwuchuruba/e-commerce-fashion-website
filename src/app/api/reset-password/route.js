import connectToDB from "@/database";
import Token from "@/models/token";
import User from "@/models/user";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { hash,compare } from "bcryptjs";


const bcryptSalt = 10;

const passwordComplexityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[0-9a-zA-Z!@#$%^&*()-_+=]{8,}$/;

const schema = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().required(),
  newPassword: Joi.string()
  .min(6)
  .regex(passwordComplexityRegex)
  .required()
  .messages({
    'string.pattern.base':
      'Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.',
  }),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { userId, token, newPassword } = await req.json();

  const { error } = schema.validate({ userId, token, newPassword });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const checkUser = await User.findOne({ _id: userId });
    if (!checkUser) {
      return NextResponse.json({
        success: false,
        message: "User not found with this ID.",
      });
    }


    const checkToken = await Token.findOne({ userId });
    if (!checkToken) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    const isMatch = await compare(token, checkToken.token);
    if (!isMatch){
        throw new Error(`Tokens don't match`)
    }

    const hashedPassword = await hash(newPassword, Number(bcryptSalt))
    const result = await User.updateOne(
        { _id: userId },
        { $set: { password: hashedPassword } }
    );


    if (result.nModified > 0) {
      // Password updated successfully
      return NextResponse.json({
        success: true,
        message: "Password Update Successful.",
      });
    } else {
      // No document was modified, meaning the password was already updated
      return NextResponse.json({
        success: true,
        message: "Password already updated.",
      });
    }
    // const token = jwt.sign(
    //   {
    //     id: checkUser._id,
    //     email: checkUser?.email,
    //     role: checkUser?.role,
    //   },
    //   "default_secret_key",
    //   { expiresIn: "1d" }
    // );

    // const finalData = {
    //   token,
    //   user: {
    //     email: checkUser.email,
    //     name: checkUser.name,
    //     _id: checkUser._id,
    //     role: checkUser.role,
    //   },
    // };

   
  } catch (e) {
    console.log('Error resetting password.');

    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}