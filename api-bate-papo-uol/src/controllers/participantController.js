import dayjs from 'dayjs';
import { stripHtml } from "string-strip-html";
import joi from 'joi';
import db from '../db.js';

const participantSchema = joi.object({
  name: joi.string().required()
});

export async function createParticipant(req, res) {
  const participant = req.body;

  const validation = participantSchema.validate(participant);
  if (validation.error) {
    return res.sendStatus(422)
  }

  participant.name = stripHtml(participant.name).result.trim();

  try {
    const participantsCollection = db.collection("participants");
    const messagesCollection = db.collection("messages");

    const existingParticipant = await participantsCollection.findOne({ name: participant.name });
    if (existingParticipant) {
      return res.sendStatus(409);
    }

    await participantsCollection.insertOne({ ...participant, lastStatus: Date.now() });

    await messagesCollection.insertOne({
      from: participant.name,
      to: 'Todos',
      text: 'entra na sala...',
      type: 'status',
      time: dayjs().format("HH:mm:ss")
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getParticipants(req, res) {
  try {
    const participantsCollection = db.collection("participants");

    const participants = await participantsCollection.find({}).toArray();

    res.send(participants);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateStatus(req, res) {
  const participant = req.headers.user;

  try {
    const participantsCollection = db.collection("participants");

    const existingParticipant = await participantsCollection.findOne({ name: participant })
    if (!existingParticipant) {
      return res.sendStatus(404);
    }

    await participantsCollection.updateOne({
      _id: existingParticipant._id
    }, {
      $set: { lastStatus: Date.now() }
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

setInterval(async () => {
  try {
    const lastTenSeconds = Date.now() - 10000;

    const participantsCollection = db.collection("participants");
    const messagesCollection = db.collection("messages");

    const participants = await participantsCollection.find().toArray();

    const inactiveParticipants = participants.filter(participant => participant.lastStatus <= lastTenSeconds)
    if (inactiveParticipants.length === 0) {
      return;
    }

    //  $lte === less then or equal to, mesmo efeito do filter de cima
    await participantsCollection.deleteMany({ lastStatus: { $lte: lastTenSeconds } });

    const inactiveParticipantsMessages = inactiveParticipants.map(participant => {
      return {
        from: participant.name,
        to: 'Todos',
        text: 'sai da sala...',
        type: 'status',
        time: dayjs().format("HH:mm:ss")
      }
    })

    await messagesCollection.insertMany(inactiveParticipantsMessages);
  } catch (error) {
    console.log(error);
  }
}, 15000);