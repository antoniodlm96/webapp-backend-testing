const mocha = require('mocha');
const chai = require('chai');
const chaihttp = require('chai-http');

chai.use(chaihttp);

var should = chai.should();

describe("First test",
  function() {
    it('Test that google works', function(done) {
        chai.request('http://www.google.com')
        .get('/')
        .end(
          function(err, res) {
            console.log("Request finished");
            //console.log(res);
            console.log(err);
            res.should.have.status(200);
            done();
          }
        )
      }
    )
  }
)

describe("Test de API Usuarios",
  function() {
    it('Prueba que la API de usuarios responde', function(done) {
        chai.request('http://localhost:3000')
        .get('/apitechu/v1/hello')
        .end(
          function(err, res) {
            console.log("Request finished");
            res.should.have.status(200);
            res.body.msg.should.be.eql("Hola desde API TechU");
            done();
          }
        )
      }
    ), it('Prueba que la API de usuarios devuelve una lista de usuarios correctos', function(done) {
        chai.request('http://localhost:3000')
        .get('/apitechu/v1/users')
        .end(
          function(err, res) {
            console.log("Request finished");
            res.should.have.status(200);
            res.body.users.should.be.a("array");

            for (user of res.body.users) {
              user.should.have.property("email");
              user.should.have.property("first_name");
            }
            done();
          }
        )
      }
    )
  }
)
