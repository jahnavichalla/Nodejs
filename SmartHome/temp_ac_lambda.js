const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
    console.log("Entered main");
    try {
        await client.connect(); // Connect to MongoDB
        console.log("mongodb is connected");
        const database = client.db("room_data"); // Replace 'your_database_name' with your actual database name
        const collection = database.collection("room"); // Replace 'your_collection_name' with your actual collection name
        const newCollection = database.collection("person_door_data"); // New collection to store processed data

        const records = await collection.find({}).toArray(); // Fetch all records from the database

        let ACStatus; // Initialize AC status variable

        // Process each record
        for (const record of records) {
            const id = record.roomData.home_id;
            const roomTempCelsius = record.roomData.room_temp;
            const roomPressure = record.roomData.room_pressure;
            const personDetector = record.roomData.person_detector;
            const lightStatus = record.roomData.light_status;
            const roomdoor = record.roomData.room_door;

            // Calculate room temperature in Fahrenheit
            const roomTempFahrenheit = celsiusToFahrenheit(roomTempCelsius);

            // Calculate AC status based on room temperature
            const thresholdTemperature = 75;
            ACStatus = roomTempFahrenheit > thresholdTemperature ? 'on' : 'off';

            // Insert data into new collection
            await insertData(newCollection, id, roomTempFahrenheit, roomPressure, ACStatus, personDetector, lightStatus, roomdoor);
        }

        console.log("All operations completed");
        
        // Close the MongoDB client after all operations are completed
        await client.close();

        // Return the AC status
        return ACStatus;
    } catch (err) {
        console.error(err);
    }
}

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Function to insert data into MongoDB
async function insertData(collection, id, roomTempFahrenheit, roomPressure, ACStatus, personDetector, lightStatus, roomdoor) {
    try {
        await collection.insertOne({ id, roomTempFahrenheit, roomPressure, ACStatus, personDetector, lightStatus, roomdoor, timestamp: new Date() });
        console.log('Data inserted into MongoDB:', { id, roomTempFahrenheit, roomPressure, ACStatus, personDetector, lightStatus, roomdoor });
    } catch (err) {
        console.error(err);
    }
}

main().catch(console.error);
module.exports = { main, celsiusToFahrenheit };
