import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Variáveis globais para persistência temporária dos dados
const tweets = [];
const users = [
  {
    username: 'bobesponja', 
    avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info"
  }
];

// Rota para obter os últimos 10 tweets
app.get('/tweets', (req, res) => {
  res.json(tweets.slice(-10)); 
});

// Rota para cadastrar usuário
app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  // Verifica se os dados estão corretos
  if (!username || !avatar) {
    return res.status(400).json({ message: 'Nome de usuário e avatar são obrigatórios!' });
  }

  users.push({ username, avatar });
  res.status(201).json({ message: 'Usuário cadastrado com sucesso', username, avatar });
});

// Rota para obter todos os usuários cadastrados
app.get('/users', (req, res) => {
  res.json(users);
});

// Rota para postar um tweet
app.post('/tweets', (req, res) => {
  const { username, tweet } = req.body;

  // Verifica se os dados estão corretos
  if (!username || !tweet) {
    return res.status(400).json({ message: 'Usuário e tweet são obrigatórios!' });
  }
  // Verifica se o usuário existe
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }

  tweets.push({ username, avatar: user.avatar, tweet });
  res.status(201).json({ message: 'Tweet enviado com sucesso!' });
});

// Rota para obter os tweets de um usuário específico
app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;

  if(!username) {
    return res.status(400).json({ message: 'Usuário não encontrado!' });
  }

  const tweetsByUser = tweets.filter(tweet => tweet.username === username);
  res.json(tweetsByUser);
});

// Obtém username do header e posta o tweet
app.post('/tweets-username', (req, res) => {
  const username = req.headers.user;
  const { tweet } = req.body;

  if(!username || !tweet) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  // Verifica se o usuário existe
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }

  tweets.push({ username, tweet, avatar: user.avatar, });
  res.sendStatus(201).send("OK");
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
