import { Router } from "express";
import * as authController from "../controllers/authController.js";
import userAuth from "../services/authService.js";

const authRouter = Router();

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/logout", userAuth, authController.getLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);
authRouter.get("/profile", userAuth, authController.getProfile);

export default authRouter;
