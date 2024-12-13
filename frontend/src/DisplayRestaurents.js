import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase'; // Adjust path if necessary
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function DisplayRestaurants({ onFilterChange }) {
  const [userExists, setUserExists] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [userRole, setUserRole] = useState(''); // State to store user role

  // Fetch the current user role from Firestore
  useEffect(() => {
    const checkUser = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setUserExists(true); // User exists
              setUserRole(userDoc.data().userRole); // Get the userRole from Firestore
            } else {
              setUserExists(false);
            }
          } catch (error) {
            console.error('Error checking user existence:', error);
          }
        } else {
          setUserExists(false); // No user logged in
        }
      });
    };

    checkUser();
  }, []); 

  // Fetch restaurants from the "restaurants" collection in Firebase
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const restaurantsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurants(restaurantsData); // Set the restaurants state
        setFilteredRestaurants(restaurantsData); // Initialize filtered restaurants with all restaurants
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter restaurants whenever selection changes
  useEffect(() => {
    const newFilteredRestaurants = restaurants.filter(restaurant => {
      return (
        (!selectedCountry || restaurant.country === selectedCountry) &&
        (!selectedCity || restaurant.city === selectedCity) &&
        (!selectedType || restaurant.type === selectedType)
      );
    });
    setFilteredRestaurants(newFilteredRestaurants);
    if (onFilterChange) onFilterChange(newFilteredRestaurants);
  }, [selectedCountry, selectedCity, selectedType, restaurants, onFilterChange]);

  // Get unique countries from the restaurants
  const countries = [...new Set(restaurants.map(restaurant => restaurant.country))];

  // Get cities filtered by selected country
  const cities = [...new Set(restaurants.filter(restaurant => restaurant.country === selectedCountry).map(restaurant => restaurant.city))];

  // Available restaurant types
  const types = ['fastfood', 'restaurant', 'café'];  // You can modify this as per your data

  return (
    <div className="selection-filter mb-[450px]">
      <h1 className="text-center text-6xl font-bold mt-0">استعرض المطاعم بالتفاصيل</h1>
      <h1 className="text-4xl text-center font-bold my-4">عروض المطاعم</h1>
      <p className='text-xl text-slate-800 font-semibold text-center mb-10'>قم بتفصيل بحثك بشكل أكبر</p>
      <div className="flex flex-row justify-center space-x-4 items-center">
        {/* Country Selection */}
        <div className="my-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md text-gray-700"
          >
            <option value="">اختر الدولة</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection (filtered by selected country) */}
        <div className="my-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md text-gray-700"
            disabled={!selectedCountry} // Disable city dropdown if no country is selected
          >
            <option value="">اختر المدينة</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Type Selection (filter based on restaurant types like 'fastfood', 'restaurant') */}
        <div className="my-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md text-gray-700"
          >
            <option value="">اختر النوع</option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display the filtered restaurants */}
      <div className="filtered-restaurants mt-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">المطاعم المتاحة</h2>

        {filteredRestaurants.length === 0 ? (
          <p className="text-center text-gray-600">لا توجد مطاعم متاحة حسب الفلاتر المحددة.</p>
        ) : (
          filteredRestaurants.map((restaurant, index) => (
            <div key={index} className="restaurant-card bg-white shadow-lg rounded-md mb-6 p-6">
              <div className="flex items-center">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">
                    الموقع: {restaurant.type}, {restaurant.city}, {restaurant.country}
                  </p>
                  <p className="text-lg font-bold text-gray-800">العروض: {restaurant.offers}</p>
                  <p className="text-sm text-gray-700">العنوان: {restaurant.address}</p>
                    <Link
                      to={`/Restaurants/${restaurant.id}`}
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      عرض التفاصيل
                    </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DisplayRestaurants;
