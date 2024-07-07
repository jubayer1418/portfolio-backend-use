import { NextFunction, Request, Response } from "express";

import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../middlewares/error";
import { SoftwareApplication } from "../models/softwareApplicationSchema";

export const addNewApplication = catchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("Software Application Icon/Image Required!", 404)
    );
  }
  const { svg }:any= req.files;
  const { name } = req.body;
  if (!name) {
    return next(new ErrorHandler("Please Provide Software's Name!", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    { folder: "PORTFOLIO SOFTWARE APPLICATION IMAGES" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }
  const softwareApplication = await SoftwareApplication.create({
    name,
    svg: {
      public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
      url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
    },
  });
  res.status(201).json({
    success: true,
    message: "New Software Application Added!",
    softwareApplication,
  });
});

export const deleteApplication = catchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  let softwareApplication :any= await SoftwareApplication.findById(id);
  if (!softwareApplication) {
    return next(new ErrorHandler("Already Deleted!", 404));
  }
  const softwareApplicationSvgId = softwareApplication.svg.public_id;
  await cloudinary.uploader.destroy(softwareApplicationSvgId);
  await softwareApplication.deleteOne();
  res.status(200).json({
    success: true,
    message: "Software Application Deleted!",
  });
});

export const getAllApplications = catchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
  const softwareApplications = await SoftwareApplication.find();
  res.status(200).json({
    success: true,
    softwareApplications,
  });
});
