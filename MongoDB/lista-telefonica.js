import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
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

app.get("/contatos", async (req, res) => {
  try {
    const contatos = await db.collection("contatos").find().toArray();
    res.send(contatos);
  } catch(err) {
    res.status(500).send({ error: "Erro ao buscar os contatos!" });
  }
});

app.post("/contatos", async (req, res) => {
  try {
    await db.collection("contatos").insertOne(req.body);
    res.sendStatus(201);
  } catch(err) {
    res.status(500).send({ error: "Erro ao inserir o contato!" });
  }
});

app.listen(5000, () => console.log("🚀 Servidor rodando na porta 5000"));