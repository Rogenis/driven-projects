import express from 'express';

const server = express();

server.get('/hello', (req, res) => {
  res.send("Meu primeiro servidor, yay!");
});


server.listen(5000);