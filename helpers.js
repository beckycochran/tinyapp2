function generateRandomString() {
  return (Math.random().toString(36).slice(2)).slice(0,(5));
}

const getUserByEmail = function(email, users) {
  const values = Object.values(users);
  for (const user of values) {
    if (user.email === email) {
      return user;
    }
  } return null;
}



module.exports = { getUserByEmail, generateRandomString };