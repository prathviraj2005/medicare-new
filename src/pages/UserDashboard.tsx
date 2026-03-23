import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRequests } from '../services/bloodbankService';
import { medicineAPI, orderAPI } from '../services/api';
import './UserDashboard.css';

interface Order {
  id: string | number;
  items: string;
  amount: number;
  status: string;
  date: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  // Use user data from context, fallback to defaults if not loaded yet
  const userInfo = {
    name: user?.name || 'User',
    email: user?.email || ''
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    if (user) {
      try {
        const [medicinesRes, ordersRes, requestsRes] = await Promise.all([
          medicineAPI.getAll(),
          orderAPI.getUserOrders(user.id),
          getUserRequests(user.id)
        ]);
        setMedicines(medicinesRes.data);

        const formattedOrders = ordersRes.data.map((o: any) => ({
          id: o.id,
          items: 'Medicine Order',
          amount: o.total_amount || 0,
          status: o.status,
          date: new Date(o.created_at || Date.now()).toLocaleDateString()
        }));
        setOrders(formattedOrders);
        setBloodRequests(requestsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBookMedicine = async (medicine: any) => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    if (window.confirm(`Do you want to book ${medicine.name} for ₹${medicine.price}?`)) {
      try {
        await orderAPI.createOrder({
          userId: user.id,
          items: [{ medicineId: medicine.id, quantity: 1, price: medicine.price }],
          totalAmount: medicine.price
        });
        alert('Medicine booked successfully! Waiting for admin approval.');
        fetchData();
        setActiveTab('orders'); // go to orders tab to see status!
      } catch (e) {
        console.error("Booking error", e);
        alert('Failed to book medicine');
      }
    }
  };

  return (
    <div className="user-dashboard">
      <div className="user-sidebar">
        <div className="user-profile">
          <div className="profile-icon">👤</div>
          <h3>{userInfo.name}</h3>
          <p>{userInfo.email}</p>
        </div>
        <nav className="user-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={activeTab === 'medicines' ? 'active' : ''} onClick={() => setActiveTab('medicines')}>
            Book Medicines
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            My Orders
          </button>
          <button className={activeTab === 'blood-requests' ? 'active' : ''} onClick={() => setActiveTab('blood-requests')}>
            Blood Requests
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            Profile
          </button>
          <button onClick={() => navigate('/blood-bank')}>
            Blood Bank
          </button>
        </nav>
      </div>

      <div className="user-content">
        {activeTab === 'overview' && (
          <div className="overview">
            <h1>Welcome, {userInfo.name}!</h1>
            <div className="quick-stats">
              <div className="stat-box">
                <h3>Total Orders</h3>
                <p className="stat-value">{orders.length}</p>
              </div>
              <div className="stat-box">
                <h3>Active Orders</h3>
                <p className="stat-value">{orders.filter(o => o.status === 'Processing').length}</p>
              </div>
              <div className="stat-box">
                <h3>Total Spent</h3>
                <p className="stat-value">₹{orders.reduce((sum, o) => sum + Number(o.amount), 0).toFixed(2)}</p>
              </div>
              <div className="stat-box clickable" onClick={() => setActiveTab('medicines')} style={{ cursor: 'pointer' }}>
                <h3>Total Medicines</h3>
                <p className="stat-value">{medicines.length}</p>
              </div>
            </div>
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => setActiveTab('medicines')}>
                  🛒 Book Medicines
                </button>
                <button className="action-btn" onClick={() => navigate('/blood-bank')}>
                  🩸 Blood Bank
                </button>
                <button className="action-btn" onClick={() => setActiveTab('orders')}>
                  📦 View Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medicines' && (
          <div className="medicines-view">
            <h1>Book Medicines</h1>
            <p className="section-info">Browse and book medicines. Your orders will be reviewed by admin.</p>
            {loading ? (
              <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p>Loading medicines...</p>
              </div>
            ) : medicines.length > 0 ? (
              <div className="medicines-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {medicines.map(med => (
                  <div key={med.id} className="medicine-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <h3>{med.name}</h3>
                    <p><strong>Price:</strong> ₹{med.price}</p>
                    <p><strong>Category:</strong> {med.category}</p>
                    <p><strong>Description:</strong> {med.description}</p>
                    <button onClick={() => handleBookMedicine(med)} className="btn btn-primary" style={{ marginTop: '10px', width: '100%' }}>Book Now</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results" style={{ textAlign: 'center', padding: '40px' }}>
                <p>No medicines available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-view">
            <h1>My Orders</h1>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.items}</td>
                    <td>₹{order.amount}</td>
                    <td>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'blood-requests' && (
          <div className="orders-view">
            <h1>My Blood Requests</h1>
            {bloodRequests.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodRequests.map(req => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.patient_name}</td>
                      <td>{req.blood_group}</td>
                      <td>{req.units_needed}</td>
                      <td>
                        <span className={`status ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>{new Date(req.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No blood requests found.</p>
            )}
          </div>
        )}



        {activeTab === 'profile' && (
          <div className="profile-view">
            <h1>My Profile</h1>
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={userInfo.name} readOnly />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={userInfo.email} readOnly />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Not provided" readOnly />
              </div>
              <button className="btn btn-primary">Edit Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
