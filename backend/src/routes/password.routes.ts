import express from "express";
import { isAuth } from "../middleware/auth";
import {
  createPassword,
  deletePassword,
  getAll,
  modifyPassword,
  searchPassword,
  sharePassword,
} from "../controller/password.controller";
import { upload } from "../utils/Multer";

const PasswordRouter = express.Router();

PasswordRouter.get("/", isAuth, getAll);
PasswordRouter.post("/create", isAuth, upload.single("file"), createPassword);
PasswordRouter.put("/update/:id", isAuth,upload.single("file"), modifyPassword);
PasswordRouter.delete("/delete/:id", isAuth, deletePassword);
PasswordRouter.post("/share/:id", isAuth, sharePassword);
PasswordRouter.get("/search", isAuth, searchPassword);

export default PasswordRouter;
