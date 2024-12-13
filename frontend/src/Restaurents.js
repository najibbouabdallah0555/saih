import React, { useEffect, useState, useCallback } from 'react'; 
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import Loader from './Loader';

const Restaurents = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState({});
  const [booking, setBooking] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    people: '',
  });

  // جلب تفاصيل المطعم
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantDoc = await getDoc(doc(db, 'restaurants', id));
        if (restaurantDoc.exists()) {
          const restaurantData = restaurantDoc.data();
          setRestaurant({ id: restaurantDoc.id, ...restaurantData });
          setEditRestaurant({ ...restaurantData });
        } else {
          console.error('المطعم غير موجود.');
        }
      } catch (error) {
        console.error('خطأ في جلب المطعم:', error.message);
      }
    };

    fetchRestaurant();
  }, [id]);

  // معالج لتحديث حالة التعديل
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditRestaurant((prev) => ({ ...prev, [name]: value }));
  }, []);

  // معالج لحفظ تعديلات المطعم
  const handleUpdateRestaurant = async () => {
    try {
      const restaurantDoc = doc(db, 'restaurants', restaurant.id);
      await updateDoc(restaurantDoc, editRestaurant);
      alert('تم تحديث المطعم بنجاح!');
      setIsEditing(false);
      setRestaurant((prev) => ({ ...prev, ...editRestaurant })); // تحديث البيانات المعروضة
    } catch (error) {
      console.error('خطأ في تحديث المطعم:', error.message);
      alert('فشل في تحديث المطعم. يرجى المحاولة مرة أخرى.');
    }
  };

  if (!restaurant) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{restaurant.name}</h1>

      {isEditing ? (
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">تعديل المطعم</h2>

          {['name', 'address', 'city', 'country', 'image', 'offers', 'type'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={editRestaurant[field] || ''}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleUpdateRestaurant}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              حفظ التعديلات
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-56 object-cover rounded-lg mb-4"
          />
          <p className="text-lg mb-2">
            <strong>العنوان:</strong> {restaurant.address}
          </p>
          <p className="text-lg mb-2">
            <strong>الموقع:</strong> {restaurant.city}, {restaurant.country}
          </p>
          <p className="text-lg mb-2">
            <strong>النوع:</strong> {restaurant.type}
          </p>
          <p className="text-lg mb-4">
            <strong>العروض:</strong> {restaurant.offers}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
          >
            تعديل المطعم
          </button>
        </div>
      )}
    </div>
  );
};

export default Restaurents;
