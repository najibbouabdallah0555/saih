import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import Loader from './Loader';

const Restaurants = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [booking, setBooking] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    people: '',
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        console.log("جلب المطعم باستخدام المعرف:", id);
        const docRef = doc(db, 'restaurants', id);
        const restaurantSnap = await getDoc(docRef);
        if (restaurantSnap.exists()) {
          console.log("بيانات المطعم:", restaurantSnap.data());
          setRestaurant({ id: restaurantSnap.id, ...restaurantSnap.data() });
        } else {
          console.error('لا يوجد مثل هذا المستند!');
        }
      } catch (error) {
        console.error('خطأ في جلب المطعم:', error.message);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleBookingSubmit = async () => {
    if (!booking.name || !booking.email || !booking.date || !booking.time || !booking.people) {
      alert('يرجى ملء جميع الحقول.');
      return;
    }

    try {
      const bookingData = {
        restaurantId: restaurant?.id,
        partnerId: restaurant?.partnerId || 'مجهول', // تعيين إلى "مجهول" إذا كانت partnerId مفقودة
        ...booking,
      };
      console.log("إرسال الحجز:", bookingData);

      await addDoc(collection(db, 'bookings'), bookingData);
      alert('تم إرسال طلب الحجز بنجاح!');
      setBooking({ name: '', email: '', date: '', time: '', people: '' });
    } catch (error) {
      console.error('خطأ في إرسال طلب الحجز:', error.message);
      alert('فشل في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.');
    }
  };

  if (!restaurant) return <div><Loader/></div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <div className="mb-6">
        <p>العنوان: {restaurant.address}</p>
        <p>الموقع: {restaurant.city}, {restaurant.country}</p>
        <p>النوع: {restaurant.type}</p>
        <p>العروض: {restaurant.offers}</p>
      </div>
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">نموذج الحجز</h2>
        <input
          type="text"
          placeholder="اسمك"
          value={booking.name}
          onChange={(e) => setBooking({ ...booking, name: e.target.value })}
          className="block w-full p-2 mb-2 border rounded"
        />
        <input
          type="email"
          placeholder="بريدك الإلكتروني"
          value={booking.email}
          onChange={(e) => setBooking({ ...booking, email: e.target.value })}
          className="block w-full p-2 mb-2 border rounded"
        />
        <input
          type="date"
          value={booking.date}
          onChange={(e) => setBooking({ ...booking, date: e.target.value })}
          className="block w-full p-2 mb-2 border rounded"
        />
        <input
          type="time"
          value={booking.time}
          onChange={(e) => setBooking({ ...booking, time: e.target.value })}
          className="block w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="عدد الأشخاص"
          value={booking.people}
          onChange={(e) => setBooking({ ...booking, people: e.target.value })}
          className="block w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleBookingSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          إرسال الحجز
        </button>
      </div>
    </div>
  );
};

export default Restaurants;
