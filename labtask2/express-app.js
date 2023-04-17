
const express = require("express");
const server = express();
var reload = require('reload')

server.use(express.static("public"));

server.listen(4000, () => {
  console.log("Server Started, Visit localhost:4000");
});

reload(server);