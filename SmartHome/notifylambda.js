
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
    console.log("Entered main");
    try {
        await client.connect(); // Connect to MongoDB
        console.log("mongodb is connected");
        const database = client.db("room_data"); // Replace 'your_database_name' with your actual database name
        const collection = database.collection("person_door_data"); // Replace 'your_collection_name' with your actual collection name
        const notificationsCollection = database.collection("notifications"); // New collection to store notifications

        const records = await collection.find({}).toArray();

        // Process each record
        for (const record of records) 
        {
            const personDetector = record.person_detector;
            const ACStatus = record.AC_status;
            const doorStatus = record.room_door;
            let message;
            if (personDetector === 'no' && ACStatus === 'on' && doorStatus === 'close') 
            {
                message = 'Alert: Open door & switch off AC to save power';
            } 
            else if (personDetector === 'yes' && ACStatus === 'on' && doorStatus === 'open') {
                message = 'Close the door';
            } else {
                message = 'No action required';
            }

            await insertNotification(notificationsCollection, message);
        }

        console.log("All operations completed");
        await client.close(); // Close the MongoDB client after all operations are completed
        // return message;
    } catch (err) {
        console.error(err);
    }
}

// Function to insert notification message into MongoDB
async function insertNotification(collection, message) {
    try {
        await collection.insertOne({ message, timestamp: new Date() });
        console.log('Notification inserted into MongoDB:', message);
    } catch (err) {
        console.error(err);
    }
}

main().catch(console.error);
module.exports = { main };