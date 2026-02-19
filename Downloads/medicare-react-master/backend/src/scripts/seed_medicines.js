const pool = require('../config/database');

const medicineNames = [
    'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin', 'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Lisinopril', 'Levothyroxine', 'Azithromycin',
    'Ciprofloxacin', 'Metoprolol', 'Losartan', 'Simvastatin', 'Gabapentin', 'Hydrochlorothiazide', 'Sertraline', 'Montelukast', 'Fluticasone', 'Furosemide',
    'Pantoprazole', 'Prednisone', 'Escitalopram', 'Albuterol', 'Trazodone', 'Tramadol', 'Duloxetine', 'Carvedilol', 'Meloxicam', 'Clopidogrel',
    'Aspirin', 'Ranitidine', 'Cetirizine', 'Loratadine', 'Fexofenadine', 'Diphenhydramine', 'Dextromethorphan', 'Guaifenesin', 'Pseudoephedrine', 'Phenylephrine',
    'Naproxen', 'Diclofenac', 'Celecoxib', 'Indomethacin', 'Etodolac', 'Nabumetone', 'Sulindac', 'Ketorolac', 'Piroxicam', 'Doxycycline'
];

const categories = ['Pain Relief', 'Antibiotics', 'Diabetes', 'Heart Health', 'Digestive', 'Allergy', 'Cold & Flu', 'Vitamins', 'Supplements', 'First Aid'];
const forms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Gel', 'Spray', 'Drops', 'Inhaler'];

const generateMedicines = (count) => {
    const medicines = [];
    for (let i = 0; i < count; i++) {
        const randomName = medicineNames[Math.floor(Math.random() * medicineNames.length)];
        const randomForm = forms[Math.floor(Math.random() * forms.length)];
        const strength = (Math.floor(Math.random() * 50) + 1) * 10 + 'mg'; // 10mg to 500mg
        const finalName = `${randomName} ${strength} ${randomForm}`;

        const category = categories[Math.floor(Math.random() * categories.length)];
        const price = (Math.random() * 95 + 5).toFixed(2); // 5.00 to 100.00
        const stock = Math.floor(Math.random() * 450) + 50; // 50 to 500
        const description = `Effective ${category} medication. Consult your physician before use.`;

        medicines.push([finalName, price, description, category, stock]);
    }
    return medicines;
};

async function seed() {
    try {
        console.log('Starting seed process...');
        const medicines = generateMedicines(120); // Generate 120 medicines
        console.log(`Generated ${medicines.length} medicines.`);

        const connection = await pool.getConnection();

        // Bulk insert
        const query = 'INSERT INTO medicines (name, price, description, category, stock) VALUES ?';
        await connection.query(query, [medicines]);

        console.log('Successfully inserted medicines into database.');

        const [rows] = await connection.query('SELECT COUNT(*) as count FROM medicines');
        console.log(`Total medicines in database: ${rows[0].count}`);

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding medicines:', error);
        process.exit(1);
    }
}

seed();
