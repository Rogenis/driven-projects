import express from 'express';
import { v4 as uuid } from 'uuid';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("cadastra-ai");
});

const app = express();
app.use(express.json());

app.post("/sign-up", async (req, res) => {
  //name, email, password
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);

  await db.collection('users').insertOne({ ...user, password: passwordHash })

  res.sendStatus(201);
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection('users').findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await db.collection("sessions").insertOne({
					userId: user._id,
					token
				})
    res.send(token);
  } else {
    res.sendStatus(401);
  }
});

app.get("/meus-dados", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if(!token) return res.sendStatus(401);

  const session = await db.collection("sessions").findOne({ token});
  if(!session) return res.sendStatus(401);

  const user = await db.collection("users").findOne({ _id: session.userId });
  
  if(user) {
    delete user.password; // Remove a senha do objeto de usuário
    res.send(user);
  } else {
    res.sendStatus(401);
  }
});

app.get("/users", async (req, res) => {
  const user = await db.collection('users').find().toArray();
  res.send(user)
});

app.get("/sessions", async (req, res) => {
  const session = await db.collection('sessions').find().toArray();
  res.send(session)
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000.');
});
