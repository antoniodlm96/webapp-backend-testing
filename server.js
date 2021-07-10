require('dotenv').config();
const express = require('express');
const app = express();

var enableCORS = function(req, res, next) {
res.set("Access-Control-Allow-Origin", "*");
res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
res.set("Access-Control-Allow-Headers", "Content-Type");
next();
}

const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const accountController = require('./controllers/accountController');

app.use(express.json());
app.use(enableCORS);

const port = process.env.PORT || 3000;
app.listen(port);
console.log("API escuchando en el puerto " + port);

app.get("/apitechu/v1/hello",
  function (req, res) {
    console.log("GET /apitechu/v1/hello");

    res.send({ "msg": "Hola desde API TechU"});
  }
)

app.get("/apitechu/v1/users", userController.getUsersV1);

app.get("/apitechu/v2/users", userController.getUsersV2);

app.get("/apitechu/v2/users/:id", userController.getUserByIdV2);

app.post("/apitechu/v1/users",userController.createUserV1);

app.post("/apitechu/v2/users",userController.createUserV2);

app.delete("/apitechu/v1/users/:id",userController.deleteUsersV1);

app.delete("/apitechu/v2/users/:id",userController.deleteUsersV2);

app.post("/apitechu/v1/login", authController.loginV1);

app.post("/apitechu/v2/login", authController.loginV2);

app.post("/apitechu/v1/logout/:id", authController.logoutV1);

app.post("/apitechu/v2/logout/:id", authController.logoutV2);

app.get("/apitechu/v2/accounts/:id", accountController.accountsV2);

app.post("/apitechu/v1/monstruo/:p1/:p2",
  function(req, res) {
    console.log("Parametros");
    console.log(req.params);

    console.log("Query String");
    console.log(req.query);

    console.log("Headers");
    console.log(req.headers);

    console.log("Body");
    console.log(req.body);
  }
)
