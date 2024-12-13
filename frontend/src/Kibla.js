import React, { useState, useEffect } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { Link } from 'react-router-dom';

const QiblaCompass = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [error, setError] = useState(null);

  // Coordinates of the Kaaba in Mecca
  const KAABA_LATITUDE = 21.4225;
  const KAABA_LONGITUDE = 39.8262;

  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Calculate Qibla direction
          const qibla = calculateQibla(latitude, longitude);
          setQiblaDirection(qibla);
        },
        (err) => {
          setError('تعذر الحصول على الموقع. يرجى تمكين خدمات الموقع.');
        }
      );
    } else {
      setError('الموقع الجغرافي غير مدعوم من متصفحك.');
    }
  }, []);

  // Function to calculate Qibla direction
  const calculateQibla = (lat, lon) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const toDegrees = (radian) => (radian * 180) / Math.PI;

    const lat1 = toRadians(lat);
    const lon1 = toRadians(lon);
    const lat2 = toRadians(KAABA_LATITUDE);
    const lon2 = toRadians(KAABA_LONGITUDE);

    const deltaLon = lon2 - lon1;

    const x = Math.sin(deltaLon) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

    const qiblaAngle = toDegrees(Math.atan2(x, y));
    return (qiblaAngle + 360) % 360; // Normalize to 0–360 degrees
  };

  return (
    <div className="flex flex-col bg-[rgb(0,176,176)] w-full h-screen p-28 items-center">
     
      <h1 className="text-3xl font-bold mb-10">بوصلة القبلة</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {latitude !== null && longitude !== null ? (
            <div className="relative w-64 h-64">
              {/* Compass container */}
              <div
                className="relative w-full h-full rounded-full border-4 border-gray-400 flex items-center justify-center"
                style={{
                  transform: `rotate(${qiblaDirection}deg)`,
                  transition: 'transform 0.5s ease-in-out',
                }}
              >
                {/* Needle */}
                <div className="absolute w-1 h-32 bg-red-500 rounded-sm"></div>
                {/* Center dot */}
                <div className="absolute w-4 h-4 bg-gray-800 rounded-full"></div>
              </div>
              <p className="mt-4 text-center text-gray-700">
                اتجاه القبلة: <strong>{qiblaDirection?.toFixed(2)}°</strong>
              </p>
              <p className="text-sm text-gray-500">قم بمحاذاة الإبرة مع الشمال لتواجه القبلة.</p>
            </div>
          ) : (
            <p>جارٍ الحصول على موقعك...</p>
          )}
        </>
      )}
    </div>
  );
};

export default QiblaCompass;
