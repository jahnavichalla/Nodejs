const fs = require('fs');

async function main() {
    console.log("Entered main");
    try {
        const home1Rooms = ['room1']; // Add more room names as needed

        console.log("Start telemetry data publishing for home1");
        let completedOperations = 0;
        const totalOperations = home1Rooms.length;

        home1Rooms.forEach(roomName => {
            infiniteLoopPublish(roomName, () => {
                completedOperations++;
                if (completedOperations === totalOperations) {
                    console.log("All operations completed");
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
}

// Function sending room telemetry data every 5 seconds
async function infiniteLoopPublish(roomName, callback) {
    try {
        console.log('Sending room telemetry data for ' + roomName);
        // Get room data from JSON file
        const roomData = getRoomDataFromJSON(roomName);
        console.log(roomData);
        callback(); // Call the callback function to track completion
    } catch (err) {
        console.error(err);
    }
}

// Function to get room data from JSON file
function getRoomDataFromJSON(roomName) {
    try {
        // Assuming room data is stored in a JSON file named room_data.json
        const data = fs.readFileSync('room_data.json', 'utf8');
        const jsonData = JSON.parse(data);
        const roomData = jsonData.find(room => room.roomName === roomName);
        return roomData ? roomData.roomData : null;
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}


main().catch(console.error);
