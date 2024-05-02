const fs = require('fs');

async function main() {
    console.log("Entered main");
    try {
        const jsonData = JSON.parse(fs.readFileSync('processed_room_data.json', 'utf8'));
        console.log("Data loaded from processed_room_data.json");

        const notifications = [];

        // Process each record
        for (const record of jsonData) {
            const personDetector = record.personDetector;
            const ACStatus = record.ACStatus;
            const doorStatus = record.roomdoor;

            let message;
            if (personDetector === 'no' && ACStatus === 'on' && doorStatus === 'close') {
                message = 'Alert: Open door & switch off AC to save power';
            } else if (personDetector === 'yes' && ACStatus === 'on' && doorStatus === 'open') {
                message = 'Close the door';
            } else {
                message = 'No action required';
            }

            notifications.push({ message });
        }

        // Write notifications to a new JSON file
        fs.writeFileSync('notifications.json', JSON.stringify(notifications, null, 2));
        console.log("Notifications written to notifications.json");

        // Read and print notifications
        const printedNotifications = fs.readFileSync('notifications.json', 'utf8');
        console.log("Notifications:");
        console.log(printedNotifications);

        console.log("All operations completed");
    } catch (err) {
        console.error(err);
    }
}

main().catch(console.error);
