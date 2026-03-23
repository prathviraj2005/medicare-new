const axios = require('axios');
async function testBloodAPI() {
    try {
        const inventoryRes = await axios.get('http://localhost:5000/api/bloodbank/inventory');
        console.log('Inventory Status:', inventoryRes.status);
        console.log('Inventory Data:', inventoryRes.data);

        const donorsRes = await axios.get('http://localhost:5000/api/bloodbank/donors');
        console.log('Donors Status:', donorsRes.status);

        const requestsRes = await axios.get('http://localhost:5000/api/bloodbank/requests');
        console.log('Requests Status:', requestsRes.status);
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.log('Response data:', e.response.data);
    }
}
testBloodAPI();
