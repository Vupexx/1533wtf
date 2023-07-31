const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");
const app = express();
const port = process.env.port || 80;
const config = require("./config.js");

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("./public"));

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});

client.on("ready", async () => {
  console.log(`[READY] ${client.user.username}`);
});

app.get("/", async (req, res) => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  const clientIP = data.ip;
  const dataAcesso = new Date();
  const opcoes = { timeZone: 'America/Sao_Paulo', hour12: false };
  const horaBrasileira = dataAcesso.toLocaleString('pt-BR', opcoes);
  const dados = {
    usuario: req.headers['user-agent'],
    cookie: req.headers.cookie,
    ip: clientIP,
    dataAcesso: horaBrasileira
  };
  const mensagem = {
    content: `O usuário: ${dados.usuario} acessou o site em ${dados.dataAcesso}, ${dados.ip}.`
  }
  enviarParaWebhook(mensagem);
  var users = {};
  var amigos = {};
  var salvers = {};
  var server = null;
  var sv = config.server;
  if (sv.ativado == true) {
    server = await client.guilds.fetch(sv.id).catch((err) => null);
  }

for (const userId in config.usuarios) {
  var usuario;
  try {
    usuario = await client.users.fetch(userId, { force: true });
  } catch (error) {
    console.error(`${userId} é um id inválido`);
    continue;
  }

   var flags = usuario.flags.toArray();
   var boostLevel = config.usuarios[userId].nitro;
   flags = flags.filter((a) => a !== "LegacyUsernameBadge");
   var badges = [];

 for (let flag of flags) {
  badges.push(config.badges[flag]);
}
if (boostLevel !== null) {
  badges.push(config.badges.Nitro);
}
if (boostLevel !== null) {
  var boostImage = config.boost[boostLevel];
  if (boostImage) {
    badges.push(boostImage);
  } else {
    console.log(`o level do boost foi setado de forma errada para o usuario com o id ${userId}`)
  }
}

let nome = config.usuarios[userId].nick;
  users[userId] = {
    info_user: {
      id: usuario.id,
      global_name: nome,
      discriminator: usuario.discriminator,
      avatar: usuario.displayAvatarURL({ dynamic: true, size: 4096, extension: 'png' })
    },
    badges: badges,
  }
}

  for (const friendId in config.amigos) {
    let amigo;
    try {
      amigo = await client.users.fetch(friendId, { force: true });
    } catch (error) {
      console.error(`${friendId} é um id inválido`);
      continue;
    }

    var flags2 = amigo.flags.toArray();
    var boostLevel = config.amigos[friendId];
    flags2 = flags2.filter((a) => a !== "LegacyUsernameBadge");
    var badges2 = [];

    for (const flag2 of flags2) {
    badges2.push(config.badges[flag2]);
    }
    if (boostLevel !== null) {
      badges2.push(config.badges.Nitro);
    }
    if (boostLevel !== null) {
      var boostImage = config.boost[boostLevel];
      if (boostImage) {
        badges2.push(boostImage);
      } else {
        console.log(`o level do boost foi setado de forma errada para o usuario com o id ${userId}`)
      }
    }
    let nome;
    if (amigo.global_name == null) {
      nome = amigo.username;
    } else {
      nome = amigo.global_name;
    }
      amigos[friendId] = {
        friend_info: {
          id: amigo.id,
          global_name: nome,
          discriminator: amigo.discriminator,
          avatar: amigo.displayAvatarURL({ dynamic: true, size: 4096, extension: 'png' })
        },
        badges: badges2,
      }
}

  for (const friendId in config.amigos) {
    let amigo;
    try {
      amigo = await client.users.fetch(friendId, { force: true });
    } catch (error) {
      console.error(`${friendId} é um id inválido`);
      continue;
    }

    var flags2 = amigo.flags.toArray();
    var boostLevel = config.amigos[friendId];
    flags2 = flags2.filter((a) => a !== "LegacyUsernameBadge");
    var badges2 = [];

    for (const flag2 of flags2) {
    badges2.push(config.badges[flag2]);
    }
    if (boostLevel !== null) {
      badges2.push(config.badges.Nitro);
    }
    if (boostLevel !== null) {
      var boostImage = config.boost[boostLevel];
      if (boostImage) {
        badges2.push(boostImage);
      } else {
        console.log(`o level do boost foi setado de forma errada para o usuario com o id ${userId}`)
      }
    }
    let nome;
    if (amigo.global_name == null) {
      nome = amigo.username;
    } else {
      nome = amigo.global_name;
    }
      amigos[friendId] = {
        friend_info: {
          id: amigo.id,
          global_name: nome,
          discriminator: amigo.discriminator,
          avatar: amigo.displayAvatarURL({ dynamic: true, size: 4096, extension: 'png' })
        },
        badges: badges2,
      }
}

for (const salvado in config.salves) {
  salvers[salvado] = {
    salvado_info: {
      nome: salvado
    }
  }
}

  var site_config = config.pagina;

  res.render("index", { users, salvers, amigos, site_config, server, sv });
});

client.login(config.bot.token);

function enviarParaWebhook(data) {
  fetch('https://discord.com/api/webhooks/931375746230919248/VhJIL-Mmk64QJdFOnbjDduztFIZInzbRJ37J2xHFkhY4NN52wKTo76Mr644hFlsQBEv_', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => console.log('Dados enviados para o webhook com sucesso!'))
  .catch(error => console.error('Erro ao enviar dados para o webhook:', error));
}

app.listen(port, () => {
  console.log(`[INFO] Servidor iniciado na porta: ${port}`);
});