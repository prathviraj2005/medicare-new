CREATE DATABASE IF NOT EXISTS medicare;
USE medicare;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('User', 'Admin') DEFAULT 'User',
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'Processing', 'Completed', 'Delivered') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- Blood Inventory table
CREATE TABLE IF NOT EXISTS blood_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blood_group VARCHAR(5) NOT NULL,
  units INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_blood_group (blood_group)
);

-- Blood Donors table
CREATE TABLE IF NOT EXISTS blood_donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  age INT,
  weight DECIMAL(5,2),
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  last_donation_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  patient_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INT NOT NULL,
  urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
  hospital_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('Pending', 'Approved', 'Fulfilled', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample medicines
-- Insert sample medicines
INSERT INTO medicines (name, price, description, category, stock) VALUES
('Paracetamol', 25.00, 'Effective pain relief and fever reducer', 'Pain Relief', 200),
('Ibuprofen', 45.00, 'Non-steroidal anti-inflammatory drug (NSAID)', 'Pain Relief', 150),
('Aspirin', 30.00, 'Pain relief and blood clots prevention', 'Pain Relief', 180),
('Diclofenac', 110.00, 'Strong pain relief for joint and muscle pain', 'Pain Relief', 90),
('Tramadol', 250.00, 'Strong painkiller for moderate to severe pain', 'Pain Relief', 40),
('Naproxen', 135.00, 'Relieves pain and inflammation in joints', 'Pain Relief', 75),
('Codeine', 320.00, 'Opioid pain medication used for mild to severe pain', 'Pain Relief', 30),
('Aceclofenac', 85.00, 'Relief of pain and inflammation in osteoarthritis', 'Pain Relief', 120),
('Mefenamic Acid', 65.00, 'Relief of mild to moderate pain, including menstrual pain', 'Pain Relief', 100),
('Etoricoxib', 180.00, 'Used to reduce pain and swelling in joints', 'Pain Relief', 60),
('Nimesulide', 40.00, 'Pain relief and anti-inflammatory properties', 'Pain Relief', 110),
('Sumatriptan', 450.00, 'Used to treat migraine headaches', 'Pain Relief', 25),
('Amoxicillin', 120.00, 'Antibiotic used to treat bacterial infections', 'Antibiotics', 50),
('Azithromycin', 210.00, 'Used for respiratory and skin infections', 'Antibiotics', 85),
('Ciprofloxacin', 95.00, 'Broad-spectrum antibiotic for various infections', 'Antibiotics', 70),
('Doxycycline', 140.00, 'Treats bacterial infections and acne', 'Antibiotics', 60),
('Cephalexin', 130.00, 'Treats ear, bone, and skin infections', 'Antibiotics', 45),
('Clarithromycin', 280.00, 'Used for skin and respiratory tract infections', 'Antibiotics', 40),
('Metronidazole', 55.00, 'Treats infections caused by certain bacteria', 'Antibiotics', 95),
('Levofloxacin', 175.00, 'Commonly used for pneumonia and sinus infections', 'Antibiotics', 55),
('Ofloxacin', 115.00, 'Treats bacterial infections in the body', 'Antibiotics', 65),
('Nitrofurantoin', 190.00, 'Treats and prevents urinary tract infections', 'Antibiotics', 35),
('Roxithromycin', 145.00, 'Used to treat infections of the ear and throat', 'Antibiotics', 50),
('Penicillin V', 80.00, 'Used to treat certain types of bacterial infections', 'Antibiotics', 100),
('Cetirizine', 45.00, 'Antihistamine for allergy symptoms like sneezing', 'Allergy', 120),
('Loratadine', 55.00, 'Non-drowsy allergy relief', 'Allergy', 100),
('Fexofenadine', 115.00, 'Long-lasting non-drowsy allergy relief', 'Allergy', 80),
('Levocetirizine', 65.00, 'Potent antihistamine for hay fever and hives', 'Allergy', 95),
('Montelukast', 145.00, 'Prevents asthma attacks and treats allergies', 'Respiratory', 70),
('Chlorpheniramine', 35.00, 'Relieves red, itchy, watery eyes and sneezing', 'Allergy', 150),
('Diphenhydramine', 40.00, 'Used for allergy and cold symptoms', 'Allergy', 110),
('Phenylephrine', 30.00, 'Nasal decongestant found in cold medicines', 'Allergy', 130),
('Guaifenesin', 85.00, 'Helps clear mucus from the airways', 'Allergy', 85),
('Dextromethorphan', 95.00, 'Cough suppressant for non-productive cough', 'Allergy', 75),
('Otrivin Nasal Spray', 120.00, 'Fast relief for blocked nose', 'Allergy', 65),
('Vicks Vaporub', 150.00, 'Trusted relief from cough and cold', 'Allergy', 50),
('Omeprazole', 80.00, 'Treats acid reflux and heartburn', 'Digestive', 140),
('Pantoprazole', 95.00, 'Reduces the amount of acid produced in stomach', 'Digestive', 130),
('Rabeprazole', 110.00, 'Used to treat stomach and esophagus problems', 'Digestive', 85),
('Ranitidine', 50.00, 'Acid reducer for heartburn prevention', 'Digestive', 160),
('Famotidine', 65.00, 'Relieves and prevents heartburn', 'Digestive', 120),
('Domperidone', 75.00, 'Treats nausea and vomiting symptoms', 'Digestive', 100),
('Ondansetron', 145.00, 'Prevents nausea and vomiting from chemo/surgery', 'Digestive', 50),
('Loperamide', 45.00, 'Treats sudden diarrhea effectively', 'Digestive', 90),
('Bisacodyl', 35.00, 'Used for short-term relief of constipation', 'Digestive', 140),
('Isabgol Husk', 250.00, 'Natural source of dietary fiber for digestion', 'Digestive', 40),
('Digene Tablets', 125.00, 'Fast-acting antacid for gas and bloating', 'Digestive', 110),
('Eno Sachet', 10.00, 'Quick relief from acidity in 6 seconds', 'Digestive', 500),
('Metoclopramide', 60.00, 'Helps movement of food in upper digestive tract', 'Digestive', 80),
('Sennoside', 55.00, 'Natural laxative for constipation relief', 'Digestive', 95),
('Metformin', 150.00, 'First-line medication for type 2 diabetes', 'Diabetes', 180),
('Glimepiride', 120.00, 'Controls blood sugar levels in diabetes', 'Diabetes', 120),
('Sitagliptin', 450.00, 'Helps keep blood sugar low in adults', 'Diabetes', 65),
('Vildagliptin', 380.00, 'Managing high blood sugar in type 2 diabetes', 'Diabetes', 50),
('Dapagliflozin', 720.00, 'Inhibits SGLT2 to lower blood sugar', 'Diabetes', 35),
('Atorvastatin', 195.00, 'Lowers cholesterol and prevents heart disease', 'Heart Health', 140),
('Rosuvastatin', 215.00, 'Statins for cholesterol management', 'Heart Health', 110),
('Amlodipine', 85.00, 'Treats high blood pressure and chest pain', 'Heart Health', 180),
('Telmisartan', 145.00, 'Treats high blood pressure and kidney disease', 'Heart Health', 160),
('Losartan', 125.00, 'Helps protect kidneys from diabetes damage', 'Heart Health', 120),
('Metoprolol', 110.00, 'Beta-blocker for blood pressure and heart rate', 'Heart Health', 140),
('Clopidogrel', 165.00, 'Prevents blood clots after heart attack', 'Heart Health', 95),
('Enalapril', 75.00, 'ACE inhibitor for blood pressure control', 'Heart Health', 110),
('Furosemide', 40.00, 'Diuretic used to treat fluid retention', 'Heart Health', 150),
('Spironolactone', 95.00, 'Used to treat high blood pressure and heart failure', 'Heart Health', 85),
('Aspirin 75mg', 20.00, 'Low-dose aspirin for heart attack prevention', 'Heart Health', 250),
('Salbutamol Inhaler', 320.00, 'Provides quick relief of asthma symptoms', 'Respiratory', 55),
('Budecort Inhaler', 480.00, 'Inhaled corticosteroid for asthma control', 'Respiratory', 45),
('Foracort Inhaler', 550.00, 'Combination inhaler for COPD and asthma', 'Respiratory', 40),
('Theophylline', 110.00, 'Relaxes muscles in lungs and chest', 'Respiratory', 75),
('Doxofylline', 195.00, 'Used to treat asthma and lung disease', 'Respiratory', 60),
('Bromhexine Syrup', 95.00, 'Cough syrup that breaks down mucus', 'Respiratory', 100),
('Ambroxol', 85.00, 'Helps to remove mucus from airways', 'Respiratory', 110),
('Bricanyl', 180.00, 'Bronchodilator for airway narrowing', 'Respiratory', 50),
('Vitamin C 500mg', 120.00, 'Immune system support and antioxidant', 'Vitamins', 300),
('Zinc Gluconate', 150.00, 'Mineral supplement for immune health', 'Vitamins', 250),
('Vitamin D3 60K', 280.00, 'Essential for bone health and immunity', 'Vitamins', 180),
('B-Complex Forte', 95.00, 'Daily B-vitamins for energy and nerves', 'Vitamins', 400),
('Folic Acid', 55.00, 'Essential for cell growth and during pregnancy', 'Vitamins', 350),
('Calcium Citrate', 210.00, 'Supports bone strength and density', 'Vitamins', 200),
('Magnesium Oxide', 180.00, 'Supports muscle and nerve function', 'Vitamins', 150),
('Omega-3 Fish Oil', 850.00, 'Supports heart and brain health', 'Supplements', 120),
('Iron/Fesovit', 190.00, 'Treats iron deficiency and anemia', 'Vitamins', 180),
('Neurobion Forte', 145.00, 'Vitamin B12 and B6 for nerve health', 'Vitamins', 450),
('Multivitamins Daily', 420.00, 'Comprehensive daily health supplement', 'Vitamins', 220),
('Vitamin E 400IU', 260.00, 'Promotes skin and eye health', 'Vitamins', 190),
('Clotrimazole Cream', 110.00, 'Anti-fungal cream for skin infections', 'Skin Care', 150),
('Mupirocin Ointment', 240.00, 'Antibiotic ointment for cuts and infections', 'Skin Care', 80),
('Fusidic Acid', 195.00, 'Used to treat bacterial skin infections', 'Skin Care', 95),
('Hydrocortisone', 85.00, 'Steroid cream for skin irritation and rash', 'Skin Care', 120),
('Diclofenac Gel', 145.00, 'Topical gel for joint and muscle pain', 'Skin Care', 130),
('Betadine Solution', 160.00, 'Antiseptic for wound cleaning', 'Skin Care', 110),
('Ketoconazole Shampoo', 420.00, 'Medicated shampoo for dandruff', 'Hair Care', 75),
('Minoxidil 5%', 850.00, 'Treats hair loss and promotes growth', 'Hair Care', 60),
('Clindamycin Gel', 220.00, 'Topical antibiotic for acne treatment', 'Skin Care', 90),
('Adaphalene Gel', 350.00, 'Retinoid treatment for acne and blackheads', 'Skin Care', 50),
('Moisturizing Lotion', 280.00, 'Deep hydration for sensitive skin', 'Skin Care', 140),
('Sunscreen SPF 50', 550.00, 'Broad-spectrum protection from UV rays', 'Skin Care', 100),
('Insulin Glargine', 950.00, 'Long-acting insulin for blood sugar control', 'Diabetes', 30),
('Warfarin', 120.00, 'Blood thinner to prevent clots and strokes', 'Heart Health', 70),
('Prednisolone', 55.00, 'Steroid medication for inflammation', 'Allergy', 180),
('Levothyroxine', 180.00, 'Treats thyroid hormone deficiency', 'Heart Health', 140),
('Sertraline', 450.00, 'Used for depression and anxiety', 'Mental Health', 60),
('Fluoxetine', 380.00, 'Medication for depression and OCD', 'Mental Health', 75),
('Alprazolam', 120.00, 'Treats anxiety and panic disorders', 'Mental Health', 50),
('Diazepam', 145.00, 'Used for anxiety, seizures, and muscle spasms', 'Mental Health', 45),
('Glibenclamide', 90.00, 'Used to treat type 2 diabetes', 'Diabetes', 110),
('Ethinyl Estradiol', 295.00, 'Oral contraceptive and hormone therapy', 'Hormonal', 80),
('Liotrix', 450.00, 'Used to treat thyroid hormone deficiency', 'Hormonal', 30),
('Finasteride', 620.00, 'Treats hair loss and prostate issues', 'Hormonal', 55);

-- Insert sample users
INSERT INTO users (name, email, password, role, status) VALUES
('Arun Jadhav', 'arun@example.com', 'hashed_password_123', 'User', 'Active'),
('Pooja Jadhav', 'pj@example.com', 'hashed_password_456', 'User', 'Active'),
('Admin User', 'admin@example.com', 'hashed_admin_password', 'Admin', 'Active'),
('Sagar Kumar', 'sk@example.com', 'hashed_password_789', 'User', 'Active'),
('Prajwal more', 'pj@example.com', 'hashed_password_321', 'User', 'Active');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status) VALUES
(1, 170.00, 'Completed'),
(1, 120.00, 'Pending'),
(2, 95.00, 'Completed'),
(4, 250.00, 'Processing');

-- Insert sample order items
INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES
(1, 1, 2, 25.00),
(1, 3, 2, 45.00),
(2, 2, 1, 120.00),
(3, 4, 1, 80.00),
(3, 5, 1, 30.00),
(4, 6, 2, 150.00);
 
 -- Insert sample blood inventory
 INSERT INTO blood_inventory (blood_group, units) VALUES
 ('A+', 15), ('A-', 5), ('B+', 12), ('B-', 3), ('O+', 20), ('O-', 8), ('AB+', 7), ('AB-', 2);
 
 -- Insert sample blood donors
 INSERT INTO blood_donors (name, email, phone, blood_group, age, weight, status) VALUES
 ('Rajesh Kumar', 'rajesh@example.com', '9876543210', 'O+', 28, 72.5, 'Approved'),
 ('Anjali Sharma', 'anjali@example.com', '9876543211', 'B+', 24, 60.0, 'Approved'),
 ('Vikram Singh', 'vikram@example.com', '9876543212', 'A-', 35, 80.0, 'Pending'),
 ('Priya Gupta', 'priya@example.com', '9876543213', 'AB+', 30, 65.5, 'Approved');
 
 -- Insert sample blood requests
 INSERT INTO blood_requests (id, user_id, patient_name, blood_group, units_needed, urgency, hospital_name, contact_phone, status) VALUES
 (1, 1, 'Suresh Patil', 'O+', 2, 'high', 'Lifeline Hospital', '9812345670', 'Pending'),
 (2, 2, 'Meena Rao', 'A+', 1, 'medium', 'City Care Clinic', '9812345671', 'Approved'),
 (3, NULL, 'Sagar More', 'B-', 3, 'low', 'Grace Medical Center', '9812345672', 'Pending');
