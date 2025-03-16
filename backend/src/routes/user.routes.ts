import express from "express";
import {
  isAuthenticated,
  logout,
  SignInController,
  SignUpController,
} from "../controller/user.controller";
import { isAuth } from "../middleware/auth";
const router = express.Router();

router.post("/signUp", SignUpController);
router.post("/signIn", SignInController);
router.get("/isAuth", isAuth, isAuthenticated);
router.get("/logout", isAuth, logout);

export default router;
