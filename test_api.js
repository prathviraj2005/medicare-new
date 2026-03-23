const axios = require('axios');
async function testMedicines() {
    try {
        const response = await axios.get('http://localhost:5000/api/medicines');
        console.log('Status:', response.status);
        console.log('Count:', response.data.length);
        console.log('First 2 medicines:', JSON.stringify(response.data.slice(0, 2), null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}
testMedicines();
