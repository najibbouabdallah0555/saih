import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // تعديل المسار إذا لزم الأمر
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoArrowLeft } from 'react-icons/go';

function Mosques() {
  const [mosques, setMosques] = useState([]);
  const [filteredMosques, setFilteredMosques] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedMosque, setSelectedMosque] = useState('');

  useEffect(() => {
    const fetchMosques = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mosques'));
        const mosquesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMosques(mosquesData); // تعيين حالة المساجد
        setFilteredMosques(mosquesData); // تهيئة المساجد المصفاة بجميع المساجد
      } catch (error) {
        console.error('خطأ في جلب المساجد:', error);
      }
    };
    fetchMosques();
  }, []);

  useEffect(() => {
    const filtered = mosques.filter(mosque => {
      return (
        (!selectedCountry || mosque.country === selectedCountry) &&
        (!selectedState || mosque.state === selectedState) &&
        (!selectedCity || mosque.city === selectedCity) &&
        (!selectedTown || mosque.town === selectedTown)
      );
    });
    setFilteredMosques(filtered);
    setSelectedMosque(''); // إعادة تعيين اختيار المسجد عند تغيير الفلاتر
  }, [selectedCountry, selectedState, selectedCity, selectedTown, mosques]);

  const countries = [...new Set(mosques.map(mosque => mosque.country))];
  const states = [...new Set(mosques.filter(mosque => mosque.country === selectedCountry).map(mosque => mosque.state))];
  const cities = [...new Set(mosques.filter(mosque => mosque.state === selectedState).map(mosque => mosque.city))];
  const towns = [...new Set(mosques.filter(mosque => mosque.city === selectedCity).map(mosque => mosque.town))];

  const mosqueNames = [...new Set(filteredMosques.map(mosque => mosque.name))];

  const mosqueDetails = filteredMosques.find(mosque => mosque.name === selectedMosque);

  return (
    <div className="mosques-page bg-[rgb(0,176,176)] p-20 w-full h-screen">
      <Link to='/OffersPage' className='absolute z-10 left-4 top-4 p-4 rounded-full border-black bg-white  hover:shadow-slate-950 hover:bg-slate-300 hover:shadow-2xl duration-75 transition-all'>
        <GoArrowLeft />
      </Link>
      <h1 className="text-center text-6xl font-bold mt-0">استكشاف المساجد حسب الموقع</h1>

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

          {/* اختيار المسجد */}
          <select
            value={selectedMosque}
            onChange={(e) => setSelectedMosque(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md"
            disabled={filteredMosques.length === 0}
          >
            <option value="">اختيار المسجد</option>
            {mosqueNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* تفاصيل المسجد */}
        {mosqueDetails && (
          <div className="mosque-details mt-10">
            <h2 className="text-3xl font-bold">{mosqueDetails.name}</h2>
            <p className="text-xl font-semibold">
              {mosqueDetails.address}, {mosqueDetails.town}, {mosqueDetails.city}, {mosqueDetails.state}, {mosqueDetails.country}
            </p>
            <div className="map-container mt-6">
              <MapContainer center={[mosqueDetails.latitude, mosqueDetails.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[mosqueDetails.latitude, mosqueDetails.longitude]} icon={new Icon({ iconUrl: 'marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                  <Popup>
                    {mosqueDetails.name}<br />
                    {mosqueDetails.address}
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

export default Mosques;
