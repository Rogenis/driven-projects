import express from "express";
const server = express();

const holidays = [
  { date: "1/1/2022", name: "Confraternização mundial" },
  { date: "1/3/2022", name: "Carnaval" },
  { date: "2/25/2025", name: "Dia do Primeiro Servidor" },
  { date: "4/17/2022", name: "Páscoa" },
  { date: "4/21/2022", name: "Tiradentes" },
  { date: "5/1/2022", name: "Dia do trabalho" },
  { date: "6/16/2022", name: "Corpus Christi" },
  { date: "9/7/2022", name: "Independência do Brasil" },
  { date: "10/12/2022", name: "Nossa Senhora Aparecida" },
  { date: "11/2/2022", name: "Finados" },
  { date: "11/15/2022", name: "Proclamação da República" },
  { date: "12/25/2022", name: "Natal" },
];

server.get("/holidays", (req, res) => {
  res.json(holidays);
});

server.get("/is-today-holiday", (req, res) => {
  const hoje = new Date();
  const hojeFormatado = hoje.toLocaleDateString();
  const holiday = holidays.find(holiday => holiday.date === hojeFormatado);

  const message = holiday ? `Sim, hoje é ${holiday.name}` : "Não, hoje não é feriado";
  res.send(message);
});

// Feriados do mês
server.get("/holidays/:id", (req, res) => {
  const { id } = req.params;
  // const monthHoliday =  holidays.filter(holiday => holiday.date.split("/")[0] === id);
  const monthHoliday = holidays.filter(holiday => parseInt(holiday.date.split("/")[0], 10) === parseInt(id, 10));

  res.send(monthHoliday);
});


server.listen(5000);