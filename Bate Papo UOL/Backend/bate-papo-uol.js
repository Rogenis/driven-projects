import express from 'express';
import dayjs from 'dayjs';
import cors from 'cors';
import Joi from 'joi';
import { MongoClient } from 'mongodb';
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoUri);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("bate-papo");
  console.log("🔥 Conectado ao MongoDB");
}).catch(err => {
  console.error("❌ Erro ao conectar ao MongoDB:", err);
});

// Esquema Joi para validação
const participantSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'string.empty': 'O nome não pode ser vazio',
    'any.required': 'O nome é obrigatório',
  }),
});
const messageSchema = Joi.object({
  to: Joi.string().min(1).required().messages({
    'string.empty': 'O campo não pode ser vazio!',
    'any.required': 'O campo é obrigatório!',
  }),
  text: Joi.string().min(1).required().messages({
    'string.empty': 'A mensagem não pode ser vazia!',
    'any.required': 'A mensagem é obrigatória!',
  }),
  type: Joi.string().valid("message", "private_message").required().messages({
    'any.only': 'O tipo deve ser "message" ou "private_message"',
    'any.required': 'O tipo da mensagem é obrigatório',
  })
});

app.get("/participants", async (req, res) => {
  try {
    const participantes = await db.collection("participantes").find().toArray();
    res.send(participantes);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar os participantes!" });
  }
});

app.post("/participants", async (req, res) => {
  try {
    const { name } = req.body;
    const { error } = participantSchema.validate(req.body);
  
    if (error) {
      return res.status(422).send({ error: error.details[0].message });
    }

    const existingParticipant = await db.collection("participantes").findOne({ name });

    if (existingParticipant) {
      return res.status(409).send("Já existe participante com esse nome!");
    }

    const participant = {
      name,
      lastStatus: Date.now() ,
    };

    await db.collection("participantes").insertOne(participant);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send({ error: "Erro ao inserir o participante!" });
  }
});

//localhost:5000/messages?limit=100
app.get("/messages", async (req, res) => {
  const user = req.headers.user;
  const { limit } = req.query;
  try {
    if (!limit) {
      // .project({ _id: 0 })  // excluindo o campo '_id'
      const userMessages = await db.collection("mensagens")
        .find({ to: { $in: [user, "Todos"] } })  // Usando $in para verificar se 'to' é 'user' ou 'Todos'
        .toArray();
  
      if (userMessages.length === 0) {
        return res.status(404).send({ error: "Conversas não encontradas!" });  
      }
      
      res.status(200).send(userMessages);
    } else {
      // .project({ _id: 0 })  // excluindo o campo '_id'
      const userMessages = await db.collection("mensagens")
        .find({ to: { $in: [user, "Todos"] } })
        .limit(parseInt(limit))  // Adicionando o limite de mensagens a serem retornadas
        .toArray();

      if (userMessages.length === 0) {
        return res.status(404).send({ error: "Conversas não encontradas!" });
      }

      res.status(200).send(userMessages);
    }
  } catch (err) {
    console.log("Erro ao retornar as mensagens:", err);
    res.status(500).send({ error: "Erro ao retornar as mensagens!" });
  }
});


app.post("/messages", async (req, res) => {
  const user = req.headers.user;
  const { error } = messageSchema.validate(req.body);
  try {
    if (error) {
      return res.status(422).send({ error: error.details[0].message });
    }

    const userExisting = await db.collection("participantes").findOne({ name: user });

    if (!userExisting) {
      return res.status(404).send({ error: "Usuário não encontrado!" });  
    }

    const mensagem = {
      from: user,
      ...req.body,
      time: dayjs().format('HH:mm:ss')
    }

    await db.collection("mensagens").insertOne(mensagem);
    res.status(201).send(mensagem); 
  } catch(err){
    res.status(500).send({ error: "Erro ao inserir a mensagem!" });
  }
});

app.post("/status", async (req, res) => {
  const user = req.headers.user;
  try {
    const result = await db.collection("participantes").updateOne(
      { name: user }, // Busca pelo nome do usuário no banco
      { $set: { lastStatus: Date.now() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Usuário não encontrado!" });
    }

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ error: "Erro ao atualizar o status!" });
  }
});

app.delete("/messages/:idMessage", async (req, res) => {
  const user = req.headers.user;
  const { idMessage } = req.params;

  try {
    // // Busca a mensagem pelo ID
    const message = await db.collection("mensagens").findOne({ _id: new ObjectId(idMessage) })
    if (!message) {
      return res.status(404).send({ error: "Mensagem não encontrada!" });
    } 
    
    if(message.from !== user) {
      return res.status(401).send({ error: "Usuário não autorizado a excluir esta mensagem!" });
    }
  
    // Deleta mensagem
    await db.collection("mensagens").deleteOne({ _id: new ObjectId(idMessage) });

    res.status(200).send({ message: "Mensagem deletada com sucesso!" });
  } catch (err) {
    res.status(500).send({ error: "Erro ao deletar a mensagem!" });
  }
});

app.put("/messages/:idMessage", async (req, res) => {
  const user = req.headers.user;
  const { idMessage } = req.params;
  const { error } = messageSchema.validate(req.body);
  try {
    if (error) {
      return res.status(422).send({ error: error.details[0].message });
    }

    const message = await db.collection("mensagens").findOne({ _id: new ObjectId(idMessage) });

    if (!message) {
      return res.status(404).send({ error: "Mensagem não encontrada!" });
    } 

    if (message.from !== user) {
      return res.status(401).send({ error: "Usuário não autorizado a atualizar esta mensagem!" });
    }

    // Atualiza mensagem
    await db.collection("mensagens").updateOne(
      { _id: new ObjectId(idMessage) }, 
      { $set: { to: req.body.to, text: req.body.text, type: req.body.type } }
    );

    res.status(200).send({ message: "Mensagem atualizada com sucesso!" });
  } catch (err) {
    res.status(500).send({ error: "Erro ao atualizar a mensagem!" });
  }
});

setInterval(async () => {
  try {
    const now = Date.now();
    const tenSecondsAgo = now - 10000;

    const inactiveUsers = await db.collection("participantes").find({ lastStatus: { $lt: tenSecondsAgo } }).toArray();

    for (const user of inactiveUsers) {
      await db.collection("participantes").deleteOne({ _id: user._id });

      const exitMessage = {
        from: user.name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: dayjs().format("HH:mm:ss"),
      };

      await db.collection("mensagens").insertOne(exitMessage);
    }
  } catch (err) {
    console.error("❌ Erro ao remover usuários inativos:", err);
  }
}, 15000);


app.listen(5000, () => console.log("🚀 Servidor rodando na porta 5000"));
