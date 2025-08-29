import express from "express";

import { deleteUser, login, register } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.delete("/delete", deleteUser);

export default authRouter;