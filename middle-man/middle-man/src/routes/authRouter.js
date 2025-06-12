import { Router } from 'express';
import validaUsuario from '../middlewares/userSchemaValidationMiddleware.js';
import { signUp, signIn } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post("/sign-up", validaUsuario, signUp);
authRouter.post("/sign-in", signIn);

export default authRouter;

