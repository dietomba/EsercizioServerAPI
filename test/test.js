process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index.js");
let User = require("../src/api/components/user/model")

chai.use(chaiHttp);

/*
 * Test the /GET route
 */
describe("Richiesta /GET su Utenti", () => {
  it("Dovrebbe restituire tutti gli utenti", (done) => {
    chai
      .request(server)
      .get("/api/user/")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});
/*
 * Test the /GET/:id route
 */
describe(" Richiesta /GET/:id su Utenti", () => {
  it("Dovrebbe restituirmi i dati di uno specifico utente", (done) => {
    let user = new User({
      email: "mariorossi@gmail.com",
      password: User.generateHash('0123456'),
      username: 'Mario78',
      role: 'reader',
    });
    user.save((err, user) => {
      chai
        .request(server)
        .get("/api/user/" + user._id)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id").eql(user._id);
          res.body.should.have.property("username");
          res.body.should.have.property("link");
          res.body.link.should.have.property("blogposts");
          res.body.link.should.have.property("comments");
          done();
        });
    });
  });
});
/*
 * Test the /POST route
 */
describe("/Richiesta /POST su Utenti", () => {
  it("dovrebbe restituire informazioni sull'utente creato", (done) => {
    let user = new User({
      email: "mariorossi@gmail.com",
      password: User.generateHash('0123456'),
      username: 'Mario78',
      role: 'reader',
    });
    chai
      .request(server)
      .post("/api/user/")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        done();
      });
  });
});
/*
 * Test the /PATCH/:id route
 */
describe("Richiesta /PATCH/:id su Utenti", () => {
  it("Dovrebbe aggiornare le proprietà di un utente con un determinato _id", (done) => {
    let user = new User({
      email: "mariorossi@gmail.com",
      password: User.generateHash('0123456'),
      username: 'Mario78',
      role: 'reader',
    });
    user.save((err, user) => {
      chai
        .request(server)
        .patch("/api/user/" + user._id)
        .send({
          email: "mariorossi@gmail.com",
          password: User.generateHash('0123456'),
          username: 'Mario78',
          role: 'author',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("User updated!");
          res.body.user.should.have.property("role").eql('author');
          done();
        });
    });
  });
});
/*
 * Test the /DELETE/:id route
 */
describe("Richiesta /DELETE/:id su Utenti", () => {
  it("Dovrebbe eliminare un utente con uno specifico _id", (done) => {
    let user = new User({
      email: "mariorossi@gmail.com",
      password: User.generateHash('0123456'),
      username: 'Mario78',
      role: 'reader',
    });
    user.save((err, user) => {
      chai
        .request(server)
        .delete("/api/user/" + user._id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("User successfully deleted!");
          res.body.result.should.have.property("ok").eql(1);
          res.body.result.should.have.property("n").eql(1);
          done();
        });
    });
  });
});
