import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models/userSchema";
import { catchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "./error";
import config from "../config";

export const isAuthenticated = catchAsyncErrors(
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler("User not Authenticated!", 400));
    }
    const decoded: any = jwt.verify(token, config.secret as string);
    req.user = (await User.findById(decoded)) as JwtPayload;
    next();
  }
);
