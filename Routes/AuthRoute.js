import express from "express";
const router = express.Router();
import { loginController } from "../Controllers/LoginController.js";

router.post("/login", loginController);

export default router;
