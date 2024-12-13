import React, { useState } from 'react';
import { db } from './firebase'; // Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const ManageRestaurant = () => {
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
    type: '',
    offers: '',
    image: '', // Image URL field
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add a new restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'restaurants'), newRestaurant);
      alert('تم إضافة المطعم بنجاح!');
      navigate('/manage-restaurants'); // Redirect after successful addition
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('فشل في إضافة المطعم');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant({ ...newRestaurant, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center absolute w-full h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen items-center justify-center bg-gray-200">
      <div className="p-4 max-w-4xl w-full backdrop-blur-xl h-full lg:h-max md:h-max sm:h-full lg:w-max sm:w-max bg-[rgb(0,176,176)] rounded-2xl shadow-xl flex justify-center items-center flex-col">
        <h2 className="backdrop-blur-xl text-3xl text-white m-4 text-center">
          إضافة مطعم جديد
        </h2>
        <h5 className="text-xl text-white m-4 text-center">
          الرجاء ملء التفاصيل لإضافة مطعمك
        </h5>

        <form onSubmit={handleAddRestaurant} className="space-y-4 flex flex-col justify-center items-center w-full">
          <input
            type="text"
            name="name"
            value={newRestaurant.name}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="اسم المطعم"
          />
          <input
            type="text"
            name="country"
            value={newRestaurant.country}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="الدولة"
          />
          <input
            type="text"
            name="city"
            value={newRestaurant.city}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="المدينة"
          />
          <input
            type="text"
            name="address"
            value={newRestaurant.address}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="العنوان"
          />
          <input
            type="text"
            name="type"
            value={newRestaurant.type}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="نوع الطعام"
          />
          <input
            type="text"
            name="offers"
            value={newRestaurant.offers}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="العروض"
          />
          <input
            type="text"
            name="image"
            value={newRestaurant.image}
            onChange={handleInputChange}
            required
            className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="رابط الصورة"
          />
          <button
            type="submit"
            className="w-full rounded-lg hover:bg-slate-300 transition-all duration-75 bg-white px-4 py-6 my-4"
            disabled={loading}
          >
            {loading ? 'جاري الإضافة...' : 'إضافة المطعم'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageRestaurant;
