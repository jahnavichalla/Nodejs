// retrieve.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function retrievePassword(username) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("LoginForm");
    const collection = database.collection("logincollections");

    const query = { name: username };

    const user = await collection.findOne(query);

    if (user) {
      console.log(`Password for user '${username}': ${user.password}`);
      const reversedPassword = reversePassword(user.password);
      console.log(`Reversed password for user '${username}': ${reversedPassword}`);
      return reversedPassword;
    } else {
      console.log(`User '${username}' not found in the database.`);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    await client.close();
  }
}

function reversePassword(password) {
  return password.split('').reverse().join('');
}

retrievePassword();
module.exports = {
  retrievePassword,
  reversePassword
};
