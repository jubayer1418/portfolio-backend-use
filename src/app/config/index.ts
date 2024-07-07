import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  port: process.env.PORT,

  MONGO_URL: process.env.MONGO_URL,
  secret: process.env.JWT_SECRET_KEY,
  jwtexpire: process.env.JWT_EXPIRES,
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PORTFOLIO_URL: process.env.PORTFOLIO_URL,
  DASHBOARD_URL: process.env.DASHBOARD_URL,
};
