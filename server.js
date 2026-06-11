const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ============================================================
// SIMULAÇÃO DE OPERAÇÃO ASSÍNCRONA
// ============================================================

function pausar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarInfo(tema) {
  await pausar(800); // simula tempo de resposta (ex: banco de dados, API)
  return (
    `Resultado sobre "${tema}": ` +
    `acesse https://developer.mozilla.org/${tema} ` +
    `ou https://nodejs.org para mais detalhes. ` +
    `Contato: suporte@${tema.toLowerCase()}.com`
  );
}
app.get('/api/buscar/:tema', async (req, res) => {
  try {
    const resultado = await buscarInfo(req.params.tema);
    res.json({ sucesso: true, texto: resultado });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// ============================================================
// ROTA 2 — RegEx: extrair links de um texto
// ============================================================

app.post('/api/links', (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ erro: 
    'Envie um campo "texto"' });

  const regex = /https?:\/\/[^\s,]+/g;
  const links = texto.match(regex) || [];

  res.json({ total: links.length, links });
});

app.post('/api/emails', (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ erro: 'Envie um campo "texto"' });

  const regex = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emails = [];

  for (const match of texto.matchAll(regex)) {
    emails.push({
      completo: match[0],
      usuario: match[1],
      dominio: match[2]
    });
  }

  res.json({ total: emails.length, emails });
});

// ============================================================
// ROTA 4 — RegEx: validar formato de e-mail
// ============================================================

app.get('/api/validar', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ erro: 'Parâmetro "email" obrigatório' });

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valido = regex.test(email);

  res.json({ email, valido });
});

// ============================================================

app.listen(3000, () => {
  console.log('\n✅  Servidor rodando em: http://localhost:3000\n');
});