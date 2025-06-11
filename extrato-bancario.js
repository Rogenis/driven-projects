import express, { json } from 'express';

const app = express();
app.use(express.json());

const extratos = [
  { cliente: 'Fulano', movimentacao: 300.00, data: "13/01/2022", tipo: "entrada" },
  { cliente: 'Ciclana', movimentacao: 210.30, data: "14/01/2022", tipo: "entrada" },
  { cliente: 'Ciclana', movimentacao: 500.00, data: "14/01/2022", tipo: "saida" },
  { cliente: 'Fulano', movimentacao: 704.30, data: "20/01/2022", tipo: "entrada" },
  { cliente: 'Ciclana', movimentacao: 600.00, data: "30/01/2022", tipo: "entrada" },
  { cliente: 'Beltrano', movimentacao: 200.50, data: "02/02/2022", tipo: "saida" },
  { cliente: 'Fulano', movimentacao: 42.80, data: "02/02/2022", tipo: "saida" },
  { cliente: 'Beltrano', movimentacao: 100.00, data: "04/02/2022", tipo: "entrada" },
  { cliente: 'Fulano', movimentacao: 20.10, data: "11/02/2022", tipo: "saida" },
  { cliente: 'Fulano', movimentacao: 300.00, data: "13/02/2022", tipo: "entrada" },
  { cliente: 'Fulano', movimentacao: 30.30, data: "21/02/2022", tipo: "saida" },
  { cliente: 'Beltrano', movimentacao: 300.20, data: "25/02/2022", tipo: "entrada" },
  { cliente: 'Ciclana', movimentacao: 100.60, data: "30/02/2022", tipo: "entrada" },
  { cliente: 'Ciclana', movimentacao: 41.00, data: "03/03/2022", tipo: "saida" },
  { cliente: 'Ciclana', movimentacao: 23.00, data: "08/03/2022", tipo: "saida" },
  { cliente: 'Fulano', movimentacao: 300.00, data: "13/03/2022", tipo: "entrada" },
  { cliente: 'Beltrano', movimentacao: 10.10, data: "15/03/2022", tipo: "saida" },
  { cliente: 'Fulano', movimentacao: 30.90, data: "20/03/2022", tipo: "saida" },
];

// Filtro por dia: localhost:5000/extrato?dia=13
app.get('/extrato', (req, res) => {
  const user = req.headers.user;
  const { dia } = req.query;

  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado!" });
  }

  const extratoDia = extratos.filter(( { cliente, data }) => {
    if(cliente !== user ) return false;
    const [diaExtrato] = data.split("/");
    return diaExtrato === dia;
  });

  if (extratoDia.length === 0) {
    return res.status(404).json({ message: "Extrato não encontrado!" });
  }

  res.status(201).json(extratoDia);
});

// // localhost:5000/extrato?dia=13&mes=01
// app.get("/extrato", (req, res) => {
// 	const user = req.headers.user;
//   const { dia, mes } = req.query;

//   if (!user) {
//     return res.status(401).json({ message: "Usuário não encontrado!" });
//   }

//   const extratoFiltrado = extratos.filter(({ cliente, data }) => {
//     if (cliente !== user) return false;

//     const [diaExtrato, mesExtrato] = data.split("/");
//     return diaExtrato === dia && mesExtrato === mes;
//   });

//   if (extratoFiltrado.length === 0) {
//     return res.status(404).json({ message: "Extrato não encontrado!" });
//   }

// 	res.status(201).json(extratoFiltrado);
// });

app.listen(5000);