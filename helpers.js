function generateRandomString() {
  return (Math.random().toString(36).slice(2)).slice(0,(5));
}


const urlsForUser = function(id, urlDatabase) {
  const userUrls = {};
  
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userUrls[url] = urlDatabase[url];
    }
  } return userUrls;
}

const getUserByEmail = function(email, users) {
  const values = Object.values(users);
  for (const user of values) {
    if (user.email === email) {
      return user;
    }
  } return null;
}



module.exports = { getUserByEmail, generateRandomString, urlsForUser };