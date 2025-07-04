import React, { useEffect, useState } from 'react';

const LocationAnnouncer = () => {
  const [locationString, setLocationString] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordsString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setLocationString(coordsString);
        
        // Announce location
        if ('speechSynthesis' in window) {
          const message = new SpeechSynthesisUtterance(`Your location is latitude ${latitude.toFixed(5)} and longitude ${longitude.toFixed(5)}`);
          window.speechSynthesis.speak(message);
        } else {
          console.warn('Speech synthesis not supported');
        }
      },
      (err) => {
        alert('Unable to retrieve your location: ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return (
    <div>
      {locationString
        ? <p>Your precise location is: {locationString}</p>
        : <p>Requesting precise location...</p>}
    </div>
  );
};

export default LocationAnnouncer;
