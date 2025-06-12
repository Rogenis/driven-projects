import userSchema from "../schemas/userSchema.js";;

async function validaUsuario(req, res, next) {
	const validation = userSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}

export default validaUsuario;