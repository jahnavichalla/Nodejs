const assert = require('assert');
const { MongoClient } = require('mongodb');
const { main: home1Main } = require('./home1_room_sensor');
const { main: tempACMain, celsiusToFahrenheit } = require('./temp_ac_lambda');
const { main: notifyMain } = require('./notifylambda');

describe('Integration Tests', function () {
    let client;

    // Hook to connect to MongoDB before running tests
    before(async function () {
        const uri = 'mongodb://localhost:27017';
        client = new MongoClient(uri);
        await client.connect();
    });

    // Hook to close MongoDB connection after running tests
    after(async function () {
        await client.close();
    });

    describe('temp_ac_lambda', function () {
        it('should return the correct AC status based on room temperature', async function () {

            // Get room data from home1_room_sensor
            const roomData = await home1Main();
            // console.log('Room data:', roomData);

            // Calculate expected AC status based on the room temperature
            const roomTempFahrenheit = celsiusToFahrenheit(roomData.room_temp);
            let expectedACStatus;
            const thresholdTemperature = 75;
            if (roomTempFahrenheit > thresholdTemperature) {
                expectedACStatus = 'on';
            } else {
                expectedACStatus = 'off';
            }
            // Call temp_ac_lambda to get the AC status
            const ac_1 = await tempACMain();

            // Compare the actual AC status returned by temp_ac_lambda with the expected AC status
            assert.strictEqual(ac_1, expectedACStatus);
        });
    });

    
    describe('notifylambda', function () {
        it('should insert notification messages into the notifications collection based on room data', async function () {
            // Create a test database and collection
            const database = client.db('room_data');
            const collection = database.collection('person_door_data');
    
            // Run the main function of notifylambda
            await notifyMain();
    
            // Check if the notification is inserted
            const notificationsCollection = database.collection('notifications');
            const notification = await notificationsCollection.findOne({});
            
            // Get the room data to determine the expected message
            const roomData = await collection.findOne({});
            console.log('Room data:', roomData);
            const { person_detector, AC_status, room_door } = roomData;
            let expectedMessage;
            if (person_detector === 'no' && AC_status === 'on' && room_door === 'close') {
                expectedMessage = 'Alert: Open door & switch off AC to save power';
            } else if (person_detector === 'yes' && AC_status === 'on' && room_door === 'open') {
                expectedMessage = 'Close the door';
            } else {
                expectedMessage = 'No action required';
            }
            
            // Compare the actual message with the expected message
            assert.strictEqual(notification.message, expectedMessage);
    
            // Clean up test data
            await collection.deleteMany({});
            await notificationsCollection.deleteMany({});
        });
    });
    
});
