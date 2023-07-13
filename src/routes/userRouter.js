import { Router } from "express";
import { searchUsers, getUserById, updateUser } from "../controllers/userController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const userRouter = Router();

userRouter.get('/searchusers', validateTokenMiddleware, searchUsers);
userRouter.get("/users/:id", validateTokenMiddleware, getUserById);
userRouter.put('/user', validateTokenMiddleware, updateUser);

export default userRouter;