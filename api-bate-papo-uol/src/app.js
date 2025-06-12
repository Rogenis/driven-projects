import express, { json } from 'express';
import cors from 'cors';
import { createParticipant, getParticipants, updateStatus } from './controllers/participantController.js';
import { createMessage, getMessages } from './controllers/messageController.js';
import { singIn, singUp} from './controllers/authController.js'

const app = express();
app.use(cors());
app.use(json());

app.post('/participants', createParticipant);

app.get('/participants', getParticipants);

app.post('/messages', createMessage);

app.get('/messages', getMessages);

app.post('/status', updateStatus)

app.post('/sign-in', singIn)

app.post('/sign-up', singUp)


app.listen(5000, () => {
  console.log("Listening on 5000")
})
