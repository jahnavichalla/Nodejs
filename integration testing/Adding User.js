
// Import necessary modules
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://localhost:27017";

// Create a new MongoClient instance
const client = new MongoClient(uri);

// Define the main function
async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database and collection
    const database = client.db("LoginForm");
    const collection = database.collection("logincollections");

    // Get username and password from command-line arguments
    const username = process.argv[2];
    const password = process.argv[3];

    // Check if both username and password are provided
    if (!username || !password) {
      console.error("Please provide both username and password as command-line arguments.");
      return;
    }

    // Create a document object with username and password
    const document = {
      name: username,
      password: password,
    };

    // Insert the document into the collection
    const result = await collection.insertOne(document);
    console.log("Document inserted:", result.insertedId);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

// Call the main function and handle errors
main().catch(console.error);
