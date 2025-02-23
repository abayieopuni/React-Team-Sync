import { Router } from "express";
import passport from "passport";
import { config } from "../config/appConfig.js";
import { googleLogInCallback } from "../controllers/authcontroller.js";



const failedURL = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`

const authRoutes = Router();

authRoutes.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

authRoutes.get("/google/callback", passport.authenticate("google", {
  failureRedirect:failedURL
}), googleLogInCallback)

export default authRoutes;