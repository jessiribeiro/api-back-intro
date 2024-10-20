"use strict";

import express from "express";

const app = express();
app.use(express.json());

let usuarios = [];
let id = 1; // Inicia o ID em 1
let idRecado = 1; // ID para os recados

// Rota inicial de boas-vindas
app.get("/", function (requisicao, resposta) {
  resposta.status(200).send("Bem-vindo ao app!");
});

// Rota para criar um usuário
app.post("/usuarios", (requisicao, resposta) => {
  const { email, nome, senha } = requisicao.body;

  if (!email || !nome || !senha) {
    return resposta.status(400).json({ mensagem: "Preencha todos os campos: email, nome e senha." });
  }

  const usuarioExistente = usuarios.find((u) => u.email === email);
  if (usuarioExistente) {
    return resposta.status(400).json({ mensagem: "E-mail já registrado." });
  }

  const usuario = { id, email, nome, senha, recados: [] }; // Adiciona um array de recados para o usuário
  usuarios.push(usuario);
  id++; 

  return resposta.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario });
});

// Rota para fazer login
app.post("/login", (requisicao, resposta) => {
  const { email, senha } = requisicao.body;

  if (!email || !senha) {
    return resposta.status(400).json({ mensagem: "Informe o e-mail e a senha." });
  }

  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
  if (!usuario) {
    return resposta.status(401).json({ mensagem: "E-mail ou senha incorretos." });
  }

  return resposta.status(200).json({ mensagem: "Login realizado com sucesso!", usuario });
});

// Rota para listar todos os usuários
app.get("/usuarios", (requisicao, resposta) => {
  resposta.json(usuarios);
});

// Rota para obter o usuário pelo ID
app.get("/usuarios/:id", (requisicao, resposta) => {
  const id = parseInt(requisicao.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  return resposta.status(200).json({ usuario });
});

// Rota para atualizar um usuário pelo ID
app.put("/usuarios/:id", (requisicao, resposta) => {
  const id = parseInt(requisicao.params.id);
  const { nome, senha } = requisicao.body;
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  if (nome) usuario.nome = nome;
  if (senha) usuario.senha = senha;

  return resposta.status(200).json({ mensagem: "Usuário atualizado com sucesso.", usuario });
});

// Rota para deletar um usuário pelo ID
app.delete("/usuarios/:id", (requisicao, resposta) => {
  const id = parseInt(requisicao.params.id);
  const indiceUsuario = usuarios.findIndex((u) => u.id === id);

  if (indiceUsuario === -1) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  usuarios.splice(indiceUsuario, 1);
  return resposta.status(200).json({ mensagem: "Usuário deletado com sucesso." });
});

// --- Rotas de Recados ---

// Rota para criar um recado usando o e-mail do usuário
app.post("/recados/:email", (requisicao, resposta) => {
  const email = requisicao.params.email;
  const { titulo, descricao } = requisicao.body;

  const usuario = usuarios.find((e) => e.email === email);
  if (!usuario) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  const recado = { id: idRecado++, titulo, descricao };
  usuario.recados.push(recado);

  return resposta.status(201).json({ mensagem: "Recado criado com sucesso!", recado });
});

// Rota para listar os recados de um usuário pelo e-mail
app.get("/recados/:email", (requisicao, resposta) => {
  const email = requisicao.params.email;
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  return resposta.status(200).json({ recados: usuario.recados });
});


// Rota para editar um recado pelo e-mail do usuário
app.put("/recados/:email/:idRecado", (requisicao, resposta) => {
  const email = requisicao.params.email;
  const idRecado = parseInt(requisicao.params.idRecado);
  const { titulo, descricao } = requisicao.body;

  const usuario = usuarios.find((u) => u.email === email);
  if (!usuario) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  const recado = usuario.recados.find((r) => r.id === idRecado);
  if (!recado) {
    return resposta.status(404).json({ mensagem: "Recado não encontrado." });
  }

  if (titulo) recado.titulo = titulo;
  if (descricao) recado.descricao = descricao;

  return resposta.status(200).json({ mensagem: "Recado atualizado com sucesso.", recado });
});

// Rota para deletar um recado pelo e-mail do usuário
app.delete("/recados/:email/:idRecado", (requisicao, resposta) => {
  const email = requisicao.params.email;
  const idRecado = parseInt(requisicao.params.idRecado);

  const usuario = usuarios.find((u) => u.email === email);
  if (!usuario) {
    return resposta.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  const indiceRecado = usuario.recados.findIndex((r) => r.id === idRecado);
  if (indiceRecado === -1) {
    return resposta.status(404).json({ mensagem: "Recado não encontrado." });
  }

  usuario.recados.splice(indiceRecado, 1);
  return resposta.status(200).json({ mensagem: "Recado deletado com sucesso." });
});

// Inicia o servidor na porta 3000
app.listen(3000, function () {
  console.log("Servidor rodando na porta 3000: http://localhost:3000");
});

