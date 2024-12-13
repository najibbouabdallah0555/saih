import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // تعديل المسار إذا لزم الأمر
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoArrowLeft } from 'react-icons/go';

function TouristAttractions() {
  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState('');

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'TouristAttractions'));
        const attractionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAttractions(attractionsData); // تعيين حالة المعالم السياحية
        setFilteredAttractions(attractionsData); // تهيئة المعالم السياحية المفلترة مع جميع المعالم
      } catch (error) {
        console.error('خطأ في جلب المعالم السياحية:', error);
      }
    };
    fetchAttractions();
  }, []);

  useEffect(() => {
    const filtered = attractions.filter(attraction => {
      return (
        (!selectedCountry || attraction.country === selectedCountry) &&
        (!selectedState || attraction.state === selectedState) &&
        (!selectedCity || attraction.city === selectedCity)
      );
    });
    setFilteredAttractions(filtered);
    setSelectedAttraction(''); // إعادة تعيين اختيار اسم المعلم عند تغيير الفلاتر
  }, [selectedCountry, selectedState, selectedCity, attractions]);

  const countries = [...new Set(attractions.map(attraction => attraction.country))];
  const states = [...new Set(attractions.filter(attraction => attraction.country === selectedCountry).map(attraction => attraction.state))];
  const cities = [...new Set(attractions.filter(attraction => attraction.state === selectedState).map(attraction => attraction.city))];

  const attractionNames = [...new Set(filteredAttractions.map(attraction => attraction.name))];

  const attractionDetails = filteredAttractions.find(attraction => attraction.name === selectedAttraction);

  return (
    <div className="attractions-page bg-[rgb(0,176,176)] p-20 w-full h-screen">
      
      <h1 className="text-center text-6xl font-bold mt-0">استكشاف المعالم السياحية حسب الموقع</h1>

      <div className="filters-container flex flex-col items-center mt-10">
        <div className="filters flex flex-row space-x-4">
          {/* اختيار البلد */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
          >
            <option value="">اختر البلد</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* اختيار الولاية */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
            disabled={!selectedCountry}
          >
            <option value="">اختر الولاية</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* اختيار المدينة */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
            disabled={!selectedState}
          >
            <option value="">اختر المدينة</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* اختيار المعلم السياحي */}
          <select
            value={selectedAttraction}
            onChange={(e) => setSelectedAttraction(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
            disabled={filteredAttractions.length === 0}
          >
            <option value="">اختر المعلم السياحي</option>
            {attractionNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* تفاصيل المعلم السياحي */}
        {attractionDetails && (
          <div className="attraction-details mt-10">
            <h2 className="text-3xl font-bold">{attractionDetails.name}</h2>
            <p className="text-xl font-semibold">
              {attractionDetails.address}, {attractionDetails.city}, {attractionDetails.state}, {attractionDetails.country}
            </p>
            <div className="map-container mt-6">
              <MapContainer center={[attractionDetails.latitude, attractionDetails.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[attractionDetails.latitude, attractionDetails.longitude]} icon={new Icon({ iconUrl: 'marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                  <Popup>
                    {attractionDetails.name}<br />
                    {attractionDetails.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TouristAttractions;
