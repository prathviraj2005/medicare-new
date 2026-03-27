const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function hashPasswords() {
    try {
        const [users] = await db.query('SELECT id, password FROM users');
        console.log(`Found ${users.length} users to update.`);

        for (const user of users) {
          // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$ and are 60 chars long)
          if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            console.log(`User ID ${user.id} already has a hashed password.`);
            continue;
          }

          const hashedPassword = await bcrypt.hash(user.password, 10);
          await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
          console.log(`Updated user ID ${user.id}`);
        }

        console.log('All passwords hashed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error hashing passwords:', error);
        process.exit(1);
    }
}

hashPasswords();
