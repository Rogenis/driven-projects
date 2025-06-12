Em todos os Controllers de rotas que precisam de validação, temos um trecho de código que **sempre** se repete:

```javascript
const validation = userSchema.validate(user);
if (validation.error) {
	return res.sendStatus(422);
}
```

Este código é aquele que valida os dados do body. Se não encontrar erros, continua pela função.

Remova esse trecho de código das funções signUp (`controllers/authController.js`) e updateUser (`controllers/userController.js`) e extraia para um **middleware**, fazendo as adaptações necessárias. 

Crie o middleware numa pasta `middlewares` com o nome `schemaValidationMiddleware.js`