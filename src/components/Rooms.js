import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './AvailableRooms.css';

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  const handleBookNow = (room) => {
    navigate(`/bookings`, { state: { room } });
  };

  return (
    <div className="rooms-container">
      <h2 className="section-title">Available Rooms</h2>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <article key={room.id} className="room-card">
            <div className="carousel-container">
              <Carousel 
                showThumbs={false} 
                showStatus={false} 
                infiniteLoop 
                autoPlay
                className="room-carousel"
              >
                {room.imageURL ? (
                  <div className="image-container">
                    <img
                      src={`/img/${room.imageURL}`}
                      alt={`${room.name}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200';
                      }}
                    />
                  </div>
                ) : (
                  <div className="image-fallback">
                    <span>No image available</span>
                  </div>
                )}
              </Carousel>
            </div>
            
            <div className="room-details">
              <h3 className="room-name">{room.name}</h3>
              <p className="room-description">{room.description}</p>
              
              <div className="room-meta">
                <div className="price-container">
                  <span className="price-label">From</span>
                  <span className="price">${room.price}</span>
                  <span className="price-period">/night</span>
                </div>
                
                <span className={`availability-tag ${room.isAvailable ? 'available' : 'unavailable'}`}>
                  {room.isAvailable ? 'Available' : 'Booked'}
                </span>
              </div>

              {room.isAvailable && (
                <button 
                  className="book-button"
                  onClick={() => handleBookNow(room)}
                >
                  Book Now
                  <span className="button-arrow">→</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AvailableRooms;