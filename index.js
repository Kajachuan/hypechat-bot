const express = require("express");
const app = express();

app.get('/', function (req, res) {
  res.send('Hola. Soy el Bot Tito');
})

app.listen(process.env.PORT || 3000);
