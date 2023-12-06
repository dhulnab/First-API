const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

let users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
app.use(express.json());

// get API
app.get("/users", (req, res) => {
  const { id, compName, city, position } = req.query;

  // get user by id
  if (id) {
    const user = users.find((el) => el.id === Number(id));
    res.send(user);
  }

  //get first user
  else if (position === "first") {
    res.send(users[0]);
  }

  //get last user
  else if (position === "last") {
    res.send(users[users.length - 1]);
  }

  // get user by company name
  else if (compName) {
    const user = users.find((el) => el.company.name === compName);
    res.send(user);
  }

  // get users by city
  else if (city) {
    const filteredUsers = users.filter((el) => el.address.city === city);
    res.send(filteredUsers);
  }

  // if no query parameter is provided, return all users
  else {
    res.send(users);
  }
});

//get street by id
app.get("/users/getStreetById/:id", (req, res) => {
  let id = req.params.id;
  let user = users.find((el) => el.id === Number(id));
  res.send(user.address.street);
});

//add new user
app.post("/users/addUser", (req, res) => {
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
app.put("/users/updateUser/:id", (req, res) => {
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
app.delete("/users/deleteUser/:id", (req, res) => {
  let id = Number(req.params.id);
  users = users.filter((el) => el.id !== id);
  res.send({ success: true });
  fs.writeFileSync("./users.json", JSON.stringify(users));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
