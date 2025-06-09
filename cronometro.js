import express from 'express';

const app = express();
let tempo = 0;
let idIntervalo;

app.post('/iniciar', (req, res) => {
  idIntervalo = setInterval(() => {
    console.log(`Tempo: ${tempo} segundos`);
    tempo++;
  }, 1000);

  res.send("Cronômetro iniciado");
});

app.post('/parar', (req, res) => {
  clearInterval(idIntervalo);
  console.log("Intervalo parado");
  res.send({ "tempo": tempo });
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});