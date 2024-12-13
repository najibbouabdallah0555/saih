import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // تكوين Firebase
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const BookingRequest = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(''); // حالة لتخزين معرّف المستخدم (partnerId)

  // جلب قائمة المطاعم
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const fetchedRestaurants = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error('خطأ في جلب المطاعم:', error);
      }
    };

    // الحصول على المستخدم الحالي وتعيين userId (partnerId)
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid); // تعيين partnerId إلى معرّف المستخدم الحالي
      } else {
        setUserId(''); // مسح userId إذا كان المستخدم غير مسجّل دخول
      }
    });

    fetchRestaurants();

    return () => unsubscribeAuth(); // تنظيف مستمع المصادقة
  }, []);

  // التعامل مع تقديم النموذج
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      alert('يرجى اختيار مطعم!');
      return;
    }

    try {
      const bookingData = {
        restaurantId: selectedRestaurant,
        partnerId: userId, // إضافة partnerId (معرّف المستخدم المسجّل دخولهم)
        name,
        email,
        phone,
        date,
        time,
        numberOfGuests,
        message,
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setSuccessMessage('تم إرسال طلب الحجز بنجاح!');
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setNumberOfGuests('');
      setMessage('');
      setSelectedRestaurant('');
      console.log('إرسال بيانات الحجز:', bookingData);
    } catch (error) {
      console.error('خطأ في إرسال طلب الحجز:', error);
      alert('فشل في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-full w-full max-w-5xl my-10">
      <h1 className="text-3xl font-bold mb-4">طلب حجز</h1>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">{successMessage}</div>
      )}
      <form onSubmit={handleBooking} className="space-y-4 bg-white p-6 rounded shadow max-w-lg mx-auto">
        <div>
          <label className="block mb-2 font-bold">اختيار مطعم</label>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              اختر مطعمًا...
            </option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name} - {restaurant.city}, {restaurant.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-bold">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">الهاتف</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">التاريخ</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">الوقت</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">عدد الضيوف</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">رسالة إضافية (اختياري)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          إرسال طلب الحجز
        </button>
      </form>
    </div>
  );
};

export default BookingRequest;
