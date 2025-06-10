import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env

const app = express();
app.use(express.json());

// Pegando a URI do .env
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017"; // fallback caso o .env não esteja definido
const mongoClient = new MongoClient(mongoUri);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("meu_lindo_projeto");
	console.log("🔥 Conectado ao MongoDB");
}).catch(err => {
	console.error("❌ Erro ao conectar ao MongoDB:", err);
});

app.get("/recipes", async (req, res) => {
	try {
		const recipes = await db.collection("recipes").find().toArray();
		res.send(recipes);
	} catch (err) {
		res.status(500).send({ error: "Erro ao buscar receitas" });
	}
});

app.post("/recipes", async (req, res) => {
	try {
		await db.collection("recipes").insertOne(req.body);
		res.sendStatus(201);
	} catch (err) {
		res.status(500).send({ error: "Erro ao inserir receita" });
	}
});

app.listen(5000, () => console.log("🚀 Servidor rodando na porta 5000"));
