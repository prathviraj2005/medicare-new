const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    // Fetch items for each order
    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.*, m.name as medicine_name, m.category, m.price as medicine_price
        FROM order_items oi
        JOIN medicines m ON oi.medicine_id = m.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      order.items = items.map(item => ({
        ...item,
        medicine: {
          id: item.medicine_id,
          name: item.medicine_name,
          category: item.category,
          price: item.medicine_price
        }
      }));
    }
    
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by user id
router.get('/user/:userId', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.userId]);
    
    // Fetch items for each order
    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.*, m.name as medicine_name, m.category, m.price as medicine_price
        FROM order_items oi
        JOIN medicines m ON oi.medicine_id = m.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      order.items = items.map(item => ({
        ...item,
        medicine: {
          id: item.medicine_id,
          name: item.medicine_name,
          category: item.category,
          price: item.medicine_price
        }
      }));
    }
    
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [userId, totalAmount]
    );

    const orderId = result.insertId;

    // Insert order items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.medicineId, item.quantity, item.price]
      );
    }

    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
