// Importações de módulos:
require("dotenv").config();
const conn = require("./db/conn");
const express = require("express");
const exphbs = require("express-handlebars");


const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Jogo = require("./models/Jogo");
const Conquista = require ("./models/Conquista");

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });

// Instanciação do servidor:
const app = express();

// Vinculação do Handlebars ao Express:
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Configurações no express para facilitar a captura
// de dados recebidos de formulários
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/usuarios", async (req,res)=>{
  
  const usuarios = await Usuario.findAll({ raw: true });

  res.render("usuarios", { usuarios });
});

app.get("/jogos", async (req,res)=>{

  const jogos = await Jogo.findAll({ raw: true });

  res.render("jogos", { jogos });
});



//////aq
app.get("/usuarios/novo",(req,res)=>{
  res.render("formUsuario");
});


app.post("/usuarios/novo", async (req, res) => {
  const dadosUsuario = {
          nickname: req.body.nickname,
          nome: req.body.nome,
      };
      const usuario = await Usuario.create(dadosUsuario);

      res.send("Usuário inserido sob o id " + usuario.id);
});

//////////nov
app.get ("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formUsuario", { usuario });
})

app.post("/usuarios/:id/update", async (req, res) =>{
  const id = parseInt(req.params.id);
  const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome,
  };

  const retorno = await Usuario.update(dadosUsuario, { where: { id: id }, });
  if(retorno>0){
      res.redirect("/usuarios");
  } else {
      res.send("erro ao atualizar usuario")
  }
});

app.post("/usuarios/:id/delete", async (req, res) =>{
  const id = parseInt(req.params.id);

  const retorno = await Usuario.destroy( { where: { id: id }, });
  if(retorno>0){
      res.redirect("/usuarios");
  } else {
      res.send("erro ao excluir usuario")
  }
});


///jogo/novo
app.post("/jogos/novo", async (req, res) => {
  const dadosJogos = {
          nome: req.body.nome,
          valorJogo: req.body.valorJogo,
          descricaoJogo: req.body.descricaoJogo,
      };
      const jogo = await Jogo.create(dadosJogos);

      res.send("Jogos inserido sob o id " + jogo.id);
});

/////fazer o post e get do jogo:(atualizar e deletar)
app.get("/jogos/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  res.render("formJogo", { jogo});
});

app.post("/jogos/:id/update", async (req, res) =>{
  const id = parseInt(req.params.id);
  const dadosJogos = {
    
      nome: req.body.nome,
      valorJogo: req.body.valorJogo,
      descricaoJogo: req.body.descricaoJogo,
  };

  const retorno = await Jogo.update(dadosJogos, { where: { id: id }});
  console.log(retorno)
  if(retorno>0){
      res.redirect("/jogos");
  } else {
      res.send("erro ao atualizar o jogo")
  }
});

app.post("/jogos/:id/delete", async (req, res) =>{
  const id = parseInt(req.params.id);

  const retorno = await Jogo.destroy( { where: { id: id }, });
  if(retorno>0){
      res.redirect("/jogos");
  } else {
      res.send("erro ao excluir jogo")
  }
});
///////////////////////////

////JOGO
app.get("/jogos/novo", (req, res) => {
  res.render("formJogo");
});




//Ver cartões do usuário
app.get("/usuarios/:id/cartoes", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  const cartoes = await Cartao.findAll({
    raw: true,
    where: { UsuarioId: id },
  });

  res.render("cartoes.handlebars", { usuario, cartoes });
});

//Formulário de cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formCartao", { usuario });
});

//Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosCartao = {
    numero: req.body.numero,
    nome: req.body.nome,
    codSeguranca: req.body.codSeguranca,
    UsuarioId: id,
  };

  await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});
///fazer conquista agr

//Ver conquista do jogo
app.get("/jogo/:id/conquista", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  const conquista = await Conquista.findAll({
    raw: true,
    where: { JogoId: id },
  });

  res.render("conquista.handlebars", { jogo, conquista });
});

//Formulário de cadastro de conquista
app.get("/jogo/:id/novaConquista", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  res.render("formConquista", { jogo });
});

//Cadastro de conquista
app.post("/jogo/:id/novaConquista", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosConquista = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    UsuarioId: id,
  };

  await Conquista.create(dadosConquista);

  res.redirect(`/jogos/${id}/conquista`);
});


///
app.listen(8000, () => {
  console.log("Server rodando!");
});

app.listen(8000, () =>{
  console.log("Server rodando na porta 8000!")
})

conn
.sync()
.then(() => {
  console.log("Conectado ao banco de dados com sucesso!");
}).catch((err) => {
  console.log("Ocorreu um erro:" + err);
});

