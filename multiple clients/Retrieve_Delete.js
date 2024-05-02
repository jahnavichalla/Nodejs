const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function retrievePassword(username) 
{
  try 
  {
    // console.log("Entered retrievePassword function");
    await client.connect();
    const database = client.db("LoginForm");
    const collection = database.collection("logincollections");

    const query = { name: username };
    const user = await collection.findOne(query);

    // Return the password if the user exists
    return user ? user.password : null;
  } 
  catch (err) 
  {
    console.warn(err);
    return null;
  }
  finally 
  {
    await client.close();
  }
}

async function deleteDocument(username) {
  try {
    console.log("Entered deleteDocument function");

    // Retrieve the password for the first time
    const password_1 = await retrievePassword(username);
    if (password_1 == null) {
      console.log('User with Username ${username} doesnt exist');
    } else {
      console.log("Password retrieved for the first time:", password_1);
    }

    console.log("Introducing delay of 5 seconds");
    // Create a promise for the 5-second delay
    const delayPromise = new Promise(resolve => {
      setTimeout(async () => {
        console.log("5 seconds delay is done");
        const password_2 = await retrievePassword(username);
        console.log("Password retrieved after 5 seconds:", password_2);
        resolve(password_2); // Resolve the promise with password_2
      }, 5000);
    });

    // Wait for the delay to complete and get the value of password_2
    const password_2 = await delayPromise;

    // Continue with the rest of the logic using password_1 and password_2
    if (password_1 && password_1.length < 8) {
      console.log("Password length is not greater than 8. Deleting the document...");
      // Delete the document
    } else if (password_1 == null) {
      console.log("User does not exist. No document deleted.");
    } else {
      console.log("Password length is greater than 8. No record deleted.");
    }

    // Return password_2
    return password_2;
  } catch (err) {
    console.warn(err);
  } finally {
    await client.close();
  }
}


async function main() {
  try {
    const username = process.argv[2];
    if (!username) {
      console.error("Please provide a username as argument");
      return;
    }
    console.log("Calling deleteDocument function");
    await deleteDocument(username);

  } catch (err) {
    console.error(err);
  }
}

// Call the main function
// main().catch(console.error);
module.exports = {
  retrievePassword,
  deleteDocument
};