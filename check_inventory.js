const db = require('./backend/src/config/database');
async function checkInventory() {
    try {
        const [rows] = await db.query('SELECT * FROM blood_inventory');
        console.log('Blood inventory rows:', rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkInventory();
