const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
async function main() {
    console.log("Entered main");
    try {
        await client.connect(); // Connect to MongoDB
        console.log("mongodb is connected");
        const database = client.db("room_data");
        const collection = database.collection("room");
        
        const roomName = 'room1'; // Specify the room name
        
        console.log("Start telemetry data publishing for", roomName);
        
        const roomData = getRoomData(roomName);
        console.log("room_data",roomData);
        console.log('Sending room telemetry data to MongoDB for', roomName);
        await insertRoomData(collection, roomName, roomData);
        console.log('Room data inserted into MongoDB for', roomName);

        console.log("All operations completed");
        client.close(); // Close the MongoDB client
        
        return roomData; // Return room data
    } catch (err) {
        console.error(err);
    }
}


// Function to insert room data into MongoDB
async function insertRoomData(collection, roomName, roomData) {
    try {
        await collection.insertOne({ roomName, roomData, timestamp: new Date() });
    } catch (err) {
        console.warn(err);
    }
}

// Generate random room data based on the roomName
function getRoomData(roomName) {
    return {
        'home_id': 2,
        'room_temp': generateRandomTemperature(),
        'room_pressure': generateRandomPressure(),
        'window_status': generateRandomStatus(),
        'AC_status': generateRandomStatus(['on', 'off']),
        'light_status': generateRandomStatus(['on', 'off']),
        'room_door': generateRandomStatus(),
        'person_detector': generateRandomStatus(['yes', 'no'])
    };
}

// Function to generate a random temperature between 0 and 100 degrees Celsius
function generateRandomTemperature() {
    return Math.floor(Math.random() * 101);
}

// Function to generate a random pressure between 800 and 1200 hPa
function generateRandomPressure() {
    return Math.floor(Math.random() * 401) + 800;
}

// Function to generate a random status (open/close, on/off, etc.)
function generateRandomStatus(options = ['open', 'close']) {
    return options[Math.floor(Math.random() * options.length)];
}

main().catch(console.error);
module.exports = { main };
