import React, { useState, useEffect } from 'react'

import { GoogleMapComponent } from '@/components';

const MainDashboard = () => {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLatitude(latitude);
          setCurrentLongitude(longitude);
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };
  return (
    <div>
      <GoogleMapComponent
        initialPosition={{
          lat: currentLatitude,
          lng: currentLongitude,
        }}
      />
    </div>
  )
}

MainDashboard.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
    </React.Fragment>
  );
};
export default MainDashboard;
