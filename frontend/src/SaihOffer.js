import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // تعديل المسار إذا لزم الأمر
import { GoArrowLeft } from 'react-icons/go';

const SaihOffer = ({ onFilterChange }) => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedserviceType, setSelectedserviceType] = useState('');

  // جلب العروض من مجموعة "offers" في Firebase
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        const offersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(offersData); // تعيين حالة العروض
        setFilteredOffers(offersData); // تهيئة العروض المفلترة مع جميع العروض
      } catch (error) {
        console.error('خطأ في جلب العروض:', error);
      }
    };
    fetchOffers();
  }, []);

  // تصفية العروض عند تغيير الاختيارات
  useEffect(() => {
    const newFilteredOffers = offers.filter(offer => {
      return (
        (!selectedCountry || offer.country === selectedCountry) &&
        (!selectedState || offer.state === selectedState) &&
        (!selectedserviceType || offer.serviceType === selectedserviceType)
      );
    });
    setFilteredOffers(newFilteredOffers);
    if (onFilterChange) onFilterChange(newFilteredOffers);
  }, [selectedCountry, selectedState, selectedserviceType, offers, onFilterChange]);

  // الحصول على الدول الفريدة من العروض
  const countries = [...new Set(offers.map(offer => offer.country))];

  // الحصول على الولايات المفلترة حسب البلد المحدد
  const states = [...new Set(offers.filter(offer => offer.country === selectedCountry).map(offer => offer.state))];

  // أنواع الخدمات المتاحة (قائمة ثابتة تحتوي على 3 خيارات)
  const serviceTypes = ['Trip', 'Halal Trip', 'Haj & 3omra'];
  
  return (
    <div className='bg-[rgb(0,176,176)] w-full h-screen py-20'>
     
      <h1 className="text-4xl text-center font-bold mb-10">مرحباً بك في عروض سايح</h1>
      <p className='text-xl text-slate-800 font-semibold text-center mb-10'>اجعل بحثك أكثر تفصيلًا</p>
      <div className="flex flex-row justify-center space-x-4 items-center">
        {/* اختيار البلد */}
        <div className="my-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md text-gray-700"
          >
            <option value="">اختر البلد</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* اختيار الولاية (مفلتر حسب البلد المحدد) */}
        <div className="my-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md text-gray-700"
            disabled={!selectedCountry} // تعطيل قائمة الولاية إذا لم يتم تحديد البلد
          >
            <option value="">اختر الولاية</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* اختيار نوع الخدمة (تصفية حسب 3 قيم) */}
        <div className="my-2">
          <select
            value={selectedserviceType}
            onChange={(e) => setSelectedserviceType(e.target.value)}
            className="px-4 py-4 text-xl font-bold border rounded-md text-gray-700"
          >
            <option value="">اختر نوع الخدمة</option>
            {serviceTypes.map((serviceType, index) => (
              <option key={index} value={serviceType}>
                {serviceType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* عرض العروض المفلترة */}
      <div className="filtered-offers mt-8 w-full flex items-center justify-around flex-col">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">العروض المتاحة</h2>

        {filteredOffers.length === 0 ? (
          <p className="text-center text-gray-600">لا توجد عروض متاحة مع الفلاتر المحددة.</p>
        ) : (
          filteredOffers.map((offer, index) => (
            <div key={index} className="offer-card bg-white shadow-lg rounded-md mb-6 p-6">
              <div className="flex items-center">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">{offer.name}</h3>
                  <p className="text-sm text-gray-600">
                    الموقع: {offer.serviceType}, {offer.state}, {offer.country}
                  </p>
                  <p className="text-lg font-bold text-gray-800">السعر: ${offer.price}</p>
                  <p className="text-sm text-gray-700">{offer.description}</p>
                  <Link
                    to={`/offer/${offer.id}`}
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
};

export default SaihOffer;
