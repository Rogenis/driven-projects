import express from 'express';

const server = express();

server.get('/', (req, res) => {
    res.send("Hello World! My Fist Server");
});

server.get("/pessoa", (req, res) => {
  const pessoa = {nome: "Rogenis", idade: 27};
  res.send(pessoa);
});

server.get("/lista-pessoas", (req, res) => {
  const pessoas = [{nome: "Rogenis", idade: 27}, {nome: "Alessandra", idade: 26}];
  res.send(pessoas);
});

server.listen(4000);