

const db = require('./src/config/database');
async function seed() {
    try {
        await db.query("INSERT INTO blood_donors (name, email, phone, blood_group, age, weight, status) VALUES ('Alice Smith', 'alice@example.com', '1234567890', 'A+', 25, 60, 'Approved'), ('Bob Jones', 'bob@example.com', '9876543210', 'O-', 35, 75, 'Pending')");
        await db.query("INSERT INTO blood_requests (patient_name, blood_group, units_needed, urgency, hospital_name, contact_phone, status) VALUES ('Charlie Brown', 'A+', 2, 'high', 'City Hospital', '555-0199', 'Pending')");
        console.log('Donors and requests seeded');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();
