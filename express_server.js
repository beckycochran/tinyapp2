const express = require("express");
const bcrypt = require('bcrypt');
const { getUserByEmail, generateRandomString, urlsForUser } = require("./helpers");

const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; 

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "1@1.com", 
    password: "1"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
app.get("/", (req, res) => {
  res.render("user-login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const id = req.session.userID;
  const user = users[id];
  const shortURLS = urlDatabase;

   const templateVars = { 
     shortURLS,
     user,
    };
   res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const username = req.cookies['username'];

  const templateVars = { shortURL, longURL, username };

  res.render("urls_new", templateVars);
});


app.post("/urls/:shortURL", (req, res) => {
  const id = req.session.userID;
  const user = users[id];

  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

  if (urlDatabase[shortURL].userID === user.id) {
    
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  } else {
    res.status(403).send("Not yours. Please <a href= '/login'>try again</a>");
  }

})

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const username = req.cookies['username'];

  const templateVars = { shortURL, longURL, username };

  res.render("urls_show", templateVars);
})


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});



app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.userID;
  const user = users[id];
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL].userID === user.id) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const id = req.session.userID;
  const user = users[id];
  res.render("user-login", { user });
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (bcrypt.compareSync(password, hashedPassword)) {
    const user = getUserByEmail(email, users);
    req.session.userID = user.id;
    return res.redirect(`/urls`);
  }
  return res.status(403).send("Invalid Credentials. Please <a href= '/login'>try again</a>"); 
});


app.post("/logout", (req, res) => {
  console.log(req.session.userID);
  req.session = null;

  res.redirect("/urls");
})

app.get("/register", (req, res) => {

  const id = req.session.userID;
  const user = users[id];
  
  res.render("user-reg", { user });
  
})

app.post("/register", (req, res) => {

 
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Missing email or password. Please <a href= '/register'>try again</a>");
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email already exists. Please <a href= '/login'>login</a> or <a href= '/register'>register with a new email.</a>");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  const user = { id, email, password: hashedPassword };
  users[id] = user;

  req.session.userID = id;
  res.redirect("/urls");

})