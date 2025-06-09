import express from 'express';

const app = express();
app.use(express.json());

const pessoas = [];

app.post('/pessoas', (req, res) => {
  const pessoa = req.body;
  pessoas.push(pessoa);
  res.send(pessoa);
});

app.get('/pessoas', (req, res) => {
  res.send(pessoas);
});

app.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});