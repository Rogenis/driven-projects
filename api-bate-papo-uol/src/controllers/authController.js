import db from '../db.js';
import bcrypt from 'bcrypt';

export async function singIn(req, res) {
   const { email, password } = req.body;

   const user = await db.collection('users').findOne({ email });
   console.log(user);
  if (user && bcrypt.compareSync(password, user.password)) {
    res.send("Usuário autenticado com sucesso");
  } else {
    res.sendStatus(401);
  }
}

export async function singUp(req, res) {
   //name, email, password
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);

  await db.collection('users').insertOne({ ...user, password: passwordHash })

  res.sendStatus(201);
}
//   //name, email, password
//   const user = req.body;

//   const passwordHash = bcrypt.hashSync(user.password, 10);

//   await db.collection('users').insertOne({ ...user, password: passwordHash })

//   res.sendStatus(201);
// });

// app.post("/sign-in", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await db.collection('users').findOne({ email });

//   if (user && bcrypt.compareSync(password, user.password)) {
//     const token = uuid();
//     await db.collection("sessions").insertOne({
//           userId: user._id,
//           token
//         })
//     res.send(token);
//   } else {
//     res.sendStatus(401);
//   }
// });