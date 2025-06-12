import dayjs from 'dayjs';
import { stripHtml } from "string-strip-html";
import joi from 'joi';
import db from '../db.js';

const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().valid('message', 'private_message'),
});

function filterParticipantMessages(message, participant) {
  const { to, from, type } = message;

  const isFromOrToParticipant = to === participant || from === participant || to === 'Todos';
  const isPublic = type === 'message';

  if (isFromOrToParticipant || isPublic) {
    return true;
  }

  return false;
}

export async function createMessage(req, res) {
  const message = req.body;
  const from = req.headers.user;

  const validation = messageSchema.validate(message);
  if (validation.error) {
    return res.sendStatus(422);
  }

  message.to = stripHtml(message.to).result.trim();
  message.text = stripHtml(message.text).result.trim();

  try {
    const participantsCollection = db.collection("participants");
    const messagesCollection = db.collection("messages");

    const existingParticipant = await participantsCollection.findOne({ name: from })
    if (!existingParticipant) {
      return res.sendStatus(422);
    }

    await messagesCollection.insertOne({
      ...message,
      from,
      time: dayjs().format("HH:mm:ss")
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getMessages(req, res) {
  const limit = parseInt(req.query.limit);
  const participant = req.headers.user;

  try {
    const messagesCollection = db.collection("messages");

    const messages = await messagesCollection.find({}).toArray();

    const participantMessages = messages.filter((message) => filterParticipantMessages(message, participant))

    if (limit !== NaN && limit) {
      return res.send(participantMessages.slice(-limit));
    }

    res.send(participantMessages);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}