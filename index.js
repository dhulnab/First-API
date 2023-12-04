const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

let users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
app.use(express.json());

//get all users
app.get("/Users", (req, res) => {
  res.send(users);
});

//get first user
app.get("/firstUser", (req, res) => {
  res.send(users[0]);
});

//get last user
app.get("/lastUser", (req, res) => {
  res.send(users[users.length - 1]);
});

//get user by id
app.get("/find/id/:id", (req, res) => {
  let id = req.params.id;
  let user = users.find((el) => el.id === Number(id));
  res.send(user);
});

//get user by company name
app.get("/find/companyName/:compName", (req, res) => {
  let compName = req.params.compName;
  let user = users.find((el) => el.company.name === compName);
  res.send(user);
});

//get users by city
app.get("/find/city/:city", (req, res) => {
  let city = req.params.city;
  res.send(users.filter((el) => el.address.city === city));
});

//get street by id
app.get("/find/getStreetById/:id", (req, res) => {
  let id = req.params.id;
  let user = users.find((el) => el.id === Number(id));
  res.send(user.address.street);
});

//add new user
app.post("/addUser", (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let age = req.body.age;
  let email = req.body.email;
  let city = req.body.city;
  let newUser = { id, name, age, address: { city }, email };
  users.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify(users));
  res.send({ success: true });
});

//update user
app.put("/updateUser/:id", (req, res) => {
  let id = Number(req.params.id);

  index = users.findIndex((el) => el.id === id);
  if (index === -1) {
    console.log("Error: user id not found");
  } else {
    id = Number(req.body.id);
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    users[index] = { id, name, age, email };
  }
  res.send({ success: true });
  fs.writeFileSync("./users.json", JSON.stringify(users));
});

//delete user by id
app.delete("/deleteUser/:id", (req, res) => {
  let id = Number(req.params.id);
  users = users.filter((el) => el.id !== id);
  res.send({ success: true });
  fs.writeFileSync("./users.json", JSON.stringify(users));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
