const db = require('./backend/src/config/database');
async function check() {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM medicines');
        console.log('Medicine count:', rows[0].count);
        const [all] = await db.query('SELECT name FROM medicines LIMIT 10');
        console.log('Sample medicines:', all.map(m => m.name));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
