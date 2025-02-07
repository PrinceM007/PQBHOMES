import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Static loyalty benefits data
  const loyaltyBenefits = {
    'Gold Member': ['Room upgrades', 'Late checkout', 'Priority support', 'Free breakfast'],
    'Silver Member': ['Late checkout', 'Welcome drink', 'Discount coupons'],
    'Member': ['Basic benefits', 'Newsletter']
  };

  const handleCheckout = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/checkout/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to check out');
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, isAvailable: 1 } : booking
      ));
      alert('Checked out successfully!');
    } catch (err) {
      console.error(err);
      alert('Error during checkout');
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (userLoading) return;
      if (!isAuthenticated || !user?.id) {
        setError('Please login to view dashboard');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/rooms/user/${user.id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError('Unable to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, isAuthenticated, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>{error}</h3>
        {!isAuthenticated && <p>Please login to access your dashboard</p>}
      </div>
    );
  }

  // Calculate metrics
  const upcomingStays = bookings.filter(b => 
    new Date(b.checkInDate) > new Date() && b.isAvailable === 0
  ).length;

  const totalNights = bookings.reduce((sum, b) => 
    sum + Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 3600 * 24), 0
  ), 0);

  return (
    <div className="dashboard-container">
      {/* User Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome Back, {user?.username}</h1>
          <p className="member-status">{user?.tier || 'Member'} Status</p>
        </div>
        
        <div className="loyalty-card">
          <div className="loyalty-points">
            <h3>Loyalty Points</h3>
            <p className="points-value">{bookings.length}</p>
          </div>
          <div className="tier-benefits">
            <h4>Your Benefits</h4>
            <ul>
              {(loyaltyBenefits[user?.tier || 'Member'] || []).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Upcoming Stays</h3>
          <div className="metric-value">{upcomingStays}</div>
          <p className="metric-subtext">Manage your upcoming reservations</p>
        </div>

        <div className="metric-card">
          <h3>Total Nights</h3>
          <div className="metric-value">{totalNights}</div>
          <p className="metric-subtext">Nights stayed with us</p>
        </div>

        <div className="metric-card">
          <h3>Recent Rooms</h3>
          <div className="room-tags">
            {bookings.slice(0, 3).map((booking, index) => (
              <span key={index} className="room-tag">
                {booking.type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bookings-section">
        <h2 className="section-title">Your Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings found</p>
            <button className="cta-button">Book Now</button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="card-header">
                  <h3>{booking.name}</h3>
                  <span className={`status-badge ${booking.isAvailable ? 'completed' : 'active'}`}>
                    {booking.isAvailable ? 'Completed' : 'Active'}
                  </span>
                </div>
                
                <div className="booking-dates">
                  <p>
                    <span>Check-in:</span> 
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span>Check-out:</span> 
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="booking-footer">
                  <div className="price-info">
                    <p>${booking.price}/night</p>
                    <p className="total-price">Total: ${booking.totalAmount}</p>
                  </div>
                  {!booking.isAvailable && (
                    <button 
                      className="action-button"
                      onClick={() => handleCheckout(booking.id)}
                    >
                      Check Out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;