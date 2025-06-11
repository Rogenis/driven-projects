import express from "express";
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoUri);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("test");
  console.log("🔥 Conectado ao MongoDB");
}).catch(err => {
  console.error("❌ Erro ao conectar ao MongoDB:", err);
});

app.post("/sign-up", async (req, res) => {
  try {
    // nome, email, senha
    const { nome, email, senha } = req.body;

    if (!senha) {
      return res.status(400).send("Senha é obrigatória");
    }

    const passwordHash = bcrypt.hashSync(senha, 10);

    await db.collection('users').insertOne({ nome, email, senha: passwordHash });

    res.status(201).send({ nome, email });
  } catch (err) {
    res.status(500).send("Erro ao cadastrar usuário");
  }
});

app.post("/sign-in", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o email foi fornecido
    if (!email || !senha) {
      return res.status(400).send("Email e senha são obrigatórios!");
    }

    // Busca o usuário pelo email
    const user = await db.collection('users').findOne({ email });

    // Verifica se o usuário existe e se a senha está correta
    if (user && bcrypt.compareSync(senha, user.senha)) {
      return res.status(200).send("Usuário encontrado com essa senha!");
    } else {
      return res.status(401).send("Usuário ou senha incorretos!");
    }
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    return res.status(500).send("Erro ao fazer login!");
  }
});


app.listen(5000, () => console.log("🚀 Servidor rodando na porta 5000"));