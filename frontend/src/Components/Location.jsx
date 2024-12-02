import React, { useState } from 'react';

const Location = () => {
  const [location, setLocation] = useState('Your Location');

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
        },
        (error) => {
          console.error('Error fetching location:', error);
          setLocation('Unable to fetch location');
        }
      );
    } else {
      setLocation('Geolocation not supported');
    }
  };

  return <button onClick={fetchCurrentLocation}>{location}</button>;
};

export default Location;
