import express from 'express';

const app = express();
app.use(express.json());

const receitas = [
  {
    id: 1,
    titulo: "Pão com Ovo",
    ingredientes: "Ovo e pão",
    preparo: "Frite o ovo e coloque no pão",
    views: 0,
  },
  {
    id: 2,
    titulo: "Bolo",
    ingredientes: "Ovo e pão",
    preparo: "Frite o ovo e coloque no pão",
    views: 0,
  }
];
app.post("/receitas", (req, res) => {
  const { id, titulo, ingredientes, preparo } = req.body; 
  
  // 1️⃣ Validação: todos os campos são obrigatórios
  if (!titulo || !ingredientes || !preparo) {
    return res.status(422).json({ message: "Todos os campos são obrigatórios" });
  }

  // 2️⃣ Verifica se a receita já existe
  const receitaExistente = receitas.find(receita => receita.titulo === titulo);
  if (receitaExistente) {
    return res.status(400).json({ message: "Receita já existente" });
  } 

  // 3️⃣ Adiciona a nova receita
  receitas.push({ id, titulo, ingredientes, preparo });
  return res.status(201).json({ message: "Receita criada com sucesso" });
});

app.get("/receitas/:id", (req, res) => {
  const { id } = req.params;

  const idReceita = receitas.find(receita => receita.id === Number(id));

  if(!idReceita) {
    return res.status(404).json({ message: "O ID não existe!" });
  }

  return res.status(201).json(idReceita);
});

app.get("/receitas", (req, res) => {
  res.json(receitas);
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
