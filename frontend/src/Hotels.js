import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path if necessary
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoArrowLeft } from 'react-icons/go';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'hotels'));
        const hotelsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHotels(hotelsData);
        setFilteredHotels(hotelsData); // Initialize with all hotels
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const filtered = hotels.filter(hotel => {
      return (
        (!selectedCountry || hotel.country === selectedCountry) &&
        (!selectedState || hotel.state === selectedState) &&
        (!selectedCity || hotel.city === selectedCity) &&
        (!selectedTown || hotel.town === selectedTown)
      );
    });
    setFilteredHotels(filtered);
    setSelectedHotel(''); // Reset selected hotel when filters change
  }, [selectedCountry, selectedState, selectedCity, selectedTown, hotels]);

  const countries = [...new Set(hotels.map(hotel => hotel.country))];
  const states = [...new Set(hotels.filter(hotel => hotel.country === selectedCountry).map(hotel => hotel.state))];
  const cities = [...new Set(hotels.filter(hotel => hotel.state === selectedState).map(hotel => hotel.city))];
  const towns = [...new Set(hotels.filter(hotel => hotel.city === selectedCity).map(hotel => hotel.town))];

  const hotelNames = [...new Set(filteredHotels.map(hotel => hotel.name))];

  const hotelDetails = filteredHotels.find(hotel => hotel.name === selectedHotel);

  return (
    <div className="hotels-page bg-[rgb(0,176,176)] p-20 w-full h-screen">
      
      <h1 className="text-center text-6xl font-bold mt-0">استكشاف الفنادق حسب الموقع</h1>

      <div className="filters-container flex flex-col items-center mt-10">
        <div className="filters flex flex-row space-x-4">
          {/* اختيار الدولة */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
          >
            <option value="">اختيار الدولة</option>
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
            <option value="">اختيار الولاية</option>
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
            <option value="">اختيار المدينة</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* اختيار البلدة */}
          <select
            value={selectedTown}
            onChange={(e) => setSelectedTown(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
            disabled={!selectedCity}
          >
            <option value="">اختيار البلدة</option>
            {towns.map((town, index) => (
              <option key={index} value={town}>
                {town}
              </option>
            ))}
          </select>

          {/* اختيار الفندق */}
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
            disabled={filteredHotels.length === 0}
          >
            <option value="">اختيار الفندق</option>
            {hotelNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* تفاصيل الفندق */}
        {hotelDetails && (
          <div className="hotel-details mt-10">
            <h2 className="text-3xl font-bold">{hotelDetails.name}</h2>
            <p className="text-xl font-semibold">
              {hotelDetails.address}, {hotelDetails.town}, {hotelDetails.city}, {hotelDetails.state}, {hotelDetails.country}
            </p>
            <div className="map-container mt-6">
              <MapContainer
                center={[hotelDetails.latitude, hotelDetails.longitude]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[hotelDetails.latitude, hotelDetails.longitude]}
                  icon={
                    new Icon({
                      iconUrl: 'marker-icon.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                    })
                  }
                >
                  <Popup>
                    {hotelDetails.name}
                    <br />
                    {hotelDetails.address}
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

export default Hotels;
