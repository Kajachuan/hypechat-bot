var request = require('requestify');
const express = require("express");
const app = express();

app.get('/', function (req, res) {
  res.send('Hola. Soy el Bot Tito');
})

app.get('/help', function (req, res) {
  res.json({help: '@tito help: muestra los comandos disponibles.',
            info: '@tito info: muestra información del canal: integrantes, cantidad de mensajes, etc.',
            mute: '@tito mute <n>: desactiva respuestas por n segundos.',
            me:   '@tito me: muestra información del usuario que envía el mensaje.'});
})

app.get('/info', function (req, res) {
  let org = req.query.org;
  let msg;

  request.get('http://127.0.0.1:8000/organization/' + org).then(function (response) {
    let body = response.getBody()
    res.json({name: body.name,
              owner: body.owner,
              description: body.description})
  });
})

app.get('/me', function (req, res) {
  let user = req.query.user;

  request.get('http://127.0.0.1:8000/profile/' + user).then(function (response) {
    let body = response.getBody()
    res.json({username: user,
              first_name: body.first_name,
              last_name: body.last_name,
              email: body.email})
  });
})

app.listen(process.env.PORT || 3000);
