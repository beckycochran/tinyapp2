const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const { reset } = require("nodemon");
const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return (Math.random().toString(36).slice(2)).slice(0,(5));
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// returns {"b2xVn2":"http://www.lighthouselabs.ca","9sm5xK":"http://www.google.com"}
// JSON string representing entire urlDatabase object



/////// ALL GET REQUESTS SHOULD RENDER TEMPLATE VARS
/////////// ALL POST REQUESTS SHOULD REDIRECT
//////////// req.cookies is an OBJECT


////////////////////////////////////// URLS

app.get("/urls", (req, res) => {
  const username = req.cookies['username'];
  const templateVars = { urls: urlDatabase, username };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const username = req.cookies('username');
  
  console.log(req.body.longURL);
  urlDatabase[shortURL] = longURL;

  const templateVars = { urls: urlDatabase, username };

  res.render("urls_index", templateVars);
  

});


///////////////////////////////// URLS/NEW

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const username = req.cookies('username');

  urlDatabase[shortURL] = longURL;
  const templateVars = { shortURL, longURL, username };
  
  res.redirect('/urls');
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const username = req.cookies('username');

  const templateVars = { shortURL, longURL, username };

  res.render('urls_show', templateVars);
})


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  res.redirect(longURL);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  delete urlDatabase[shortURL];
  console.log(urlDatabase, 'urlDatabase');
  console.log(shortURL, 'shortURL');

  res.redirect(`/urls`);

});


app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);


  res.redirect(`/urls`);

  // const templateVars = { username };
  // res.render("urls_index", templateVars);
  
});
