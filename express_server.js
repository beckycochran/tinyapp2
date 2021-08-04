const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const { reset } = require("nodemon");
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




////////////////////////////////////// URLS

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  console.log(req.body.longURL);
  urlDatabase[shortURL] = longURL;

  const templateVars = { urls: urlDatabase };

  res.render("urls_index", templateVars);
  
  res.redirect(`/urls`);

});


///////////////////////////////// URLS/NEW

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const templateVars = { shortURL, longURL };
  
  res.render("urls_show", templateVars);
  res.redirect('/urls/:shortURL');
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const templateVars = { shortURL, longURL };

  res.render('urls_show', templateVars);
})


// POST /urls/:id


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

