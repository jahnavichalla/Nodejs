const fs = require('fs');

async function main() {
    console.log("Entered main");
    try {
        const jsonData = JSON.parse(fs.readFileSync('room_data.json', 'utf8'));
        console.log("Data loaded from room_data.json");

        if (!Array.isArray(jsonData)) {
            throw new Error("Data loaded from room_data.json is not an array");
        }

        const processedData = [];

        // Process each record
        for (const record of jsonData) {
            const id = record.roomData.home_id;
            const roomTempCelsius = record.roomData.room_temp;
            const roomPressure = record.roomData.room_pressure;
            const personDetector = record.roomData.person_detector;
            const lightStatus = record.roomData.light_status;
            const roomdoor = record.roomData.room_door;
            let ACStatus = record.roomData.AC_status;

            const roomTempFahrenheit = celsiusToFahrenheit(roomTempCelsius);

            const thresholdTemperature = 75;
            if (roomTempFahrenheit > thresholdTemperature) {
                ACStatus = 'on';
            } else {
                ACStatus = 'off';
            }

            processedData.push({
                id,
                roomTempFahrenheit,
                roomPressure,
                ACStatus,
                personDetector,
                lightStatus,
                roomdoor
            });
        }

        // Write processed data to a new JSON file
        fs.writeFileSync('processed_room_data.json', JSON.stringify(processedData, null, 2));
        console.log("Processed data written to processed_room_data.json");

        // Read and print processed data
        const printedData = JSON.parse(fs.readFileSync('processed_room_data.json', 'utf8'));
        console.log("Processed data:");
        console.log(printedData);
        
        console.log("All operations completed");
    } catch (err) {
        console.error(err);
    }
}

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

main().catch(console.error);
