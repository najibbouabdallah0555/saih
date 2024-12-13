import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './firebase'; // Adjust path if necessary
import { onAuthStateChanged } from 'firebase/auth';

function DisplayandEditRestaurant({ onFilterChange }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [userRole, setUserRole] = useState(''); // State to store user role

  useEffect(() => {
    const fetchUserRole = async () => {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userRef = collection(db, 'users');
            const q = query(userRef, where('uid', '==', user.uid)); 
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserRole(userData.role); 
            });
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        } else {
          setUserRole(''); 
        }
      });

      return () => unsubscribeAuth();
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const restaurantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(restaurantsData); 
        setFilteredRestaurants(restaurantsData); 
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const newFilteredRestaurants = restaurants.filter((restaurant) => {
      return (
        (!selectedCountry || restaurant.country === selectedCountry) &&
        (!selectedCity || restaurant.city === selectedCity) &&
        (!selectedType || restaurant.type === selectedType)
      );
    });
    setFilteredRestaurants(newFilteredRestaurants);
    if (onFilterChange) onFilterChange(newFilteredRestaurants);
  }, [selectedCountry, selectedCity, selectedType, restaurants, onFilterChange]);

  const countries = [...new Set(restaurants.map((restaurant) => restaurant.country))];
  const cities = [
    ...new Set(
      restaurants
        .filter((restaurant) => restaurant.country === selectedCountry)
        .map((restaurant) => restaurant.city)
    ),
  ];
  const types = ['Fastfood', 'Restaurant', 'Café'];

  return (
    <div className="flex w-full h-full items-center justify-center bg-gray-200">
      <div className="p-8 max-w-5xl w-full backdrop-blur-xl h-full lg:h-max md:h-max sm:h-full bg-[rgb(0,176,176)] rounded-2xl shadow-xl flex flex-col">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">استعرض وحرر المطاعم</h2>

        {/* الفلاتر */}
        <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 items-center mb-8">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="text-lg font-semibold bg-white px-4 py-4 rounded-lg outline-none transition-all duration-75 focus:bg-slate-300 w-full lg:w-1/4"
          >
            <option value="">اختر الدولة</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedCountry}
            className="text-lg font-semibold bg-white px-4 py-4 rounded-lg outline-none transition-all duration-75 focus:bg-slate-300 w-full lg:w-1/4"
          >
            <option value="">اختر المدينة</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-lg font-semibold bg-white px-4 py-4 rounded-lg outline-none transition-all duration-75 focus:bg-slate-300 w-full lg:w-1/4"
          >
            <option value="">اختر النوع</option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* المطاعم */}
        <div className="flex flex-wrap justify-center gap-6">
          {filteredRestaurants.length === 0 ? (
            <p className="text-lg font-semibold text-white">لا توجد مطاعم تطابق المعايير الخاصة بك.</p>
          ) : (
            filteredRestaurants.map((restaurant, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-lg w-full lg:w-1/3 flex flex-col items-center"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-40 h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.city}, {restaurant.country}</p>
                <p className="text-gray-600">النوع: {restaurant.type}</p>
                <p className="text-gray-600">العروض: {restaurant.offers}</p>
                <Link
                  to={`/PartnerDashboard/Restaurents/${restaurant.id}`}
                  className="mt-4 text-blue-500 hover:underline"
                >
                  عرض وتحرير
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayandEditRestaurant;
