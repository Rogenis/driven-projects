import { Router } from 'express';
import validaUsuario from '../middlewares/userSchemaValidationMiddleware.js';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get("/user", getUser);
userRouter.put("/user", validaUsuario, updateUser);
userRouter.delete("/user", deleteUser);

export default userRouter;
