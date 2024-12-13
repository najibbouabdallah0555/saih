import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; // تأكد من استيراد إعدادات Firebase
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // طرق Firestore الخاصة بـ Firebase
import Loader from './Loader';

function OfferDetailPage() {
  const { id } = useParams(); // الحصول على معرف العرض من الـ URL
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(""); // حالة للبريد الإلكتروني أو رقم الهاتف
  const [isSubmitted, setIsSubmitted] = useState(false); // تتبع حالة إرسال النموذج
  const [errorMessage, setErrorMessage] = useState(""); // للرسائل الخطأ (الحجز المكرر)

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const offerDocRef = doc(db, 'offers', id); // مرجع العرض المحدد في Firestore
        const offerDoc = await getDoc(offerDocRef);

        if (offerDoc.exists()) {
          setOffer(offerDoc.data()); // تعيين بيانات العرض في الحالة
        } else {
          console.log('لا يوجد مثل هذا العرض!');
        }
      } catch (error) {
        console.error('خطأ في جلب تفاصيل العرض:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, [id]);

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!contact) {
      alert("يرجى إدخال بريدك الإلكتروني أو رقم هاتفك.");
      return;
    }

    try {
      // التحقق مما إذا كان السائح قد حجز هذا العرض باستخدام معلومات الاتصال
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('offerId', '==', id),
        where('contact', '==', contact)
      );
      const existingBookingSnapshot = await getDocs(bookingsQuery);

      if (!existingBookingSnapshot.empty) {
        // إذا كان هناك حجز بنفس معلومات الاتصال، عرض رسالة خطأ
        setErrorMessage("لقد قمت بحجز هذا العرض بالفعل.");
        return;
      }

      // حفظ تفاصيل الحجز في مجموعة 'bookings' في Firestore
      const bookingRef = collection(db, 'bookings');
      await addDoc(bookingRef, {
        offerId: id,
        contact: contact,
        offerName: offer.OfferName,
        timestamp: new Date(),
      });

      // إعلام الشريك بإضافة إشعار في مجموعة 'notifications'
      const partnerNotificationRef = collection(db, 'notifications');
      await addDoc(partnerNotificationRef, {
        partnerId: offer.partnerId, // افتراضاً لديك partnerId مخزنة في العرض
        offerId: id,
        touristContact: { contact },
        offerName: offer.OfferName,
        timestamp: new Date(),
      });

      setIsSubmitted(true); // الإشارة إلى أن الحجز تم بنجاح
      setErrorMessage(""); 
      alert('تم إرسال طلبك بنجاح') // مسح أي رسائل خطأ سابقة
    } catch (error) {
      console.error("خطأ في إرسال الحجز:", error);
    }
  };

  if (loading) {
    return (
      <div className='w-full h-full bg-[rgb(0,176,176)] absolute z-50 flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">العرض غير موجود!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        {/* صورة العرض */}
        <img
          src={offer.image}
          alt={offer.OfferName}
          className="w-full h-64 object-cover rounded-md"
        />

        {/* تفاصيل العرض */}
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-900">{offer.OfferName}</h2>
          <p className="text-lg text-gray-700 mt-2">
            <strong>الموقع:</strong> {offer.state}, {offer.country}
          </p>
          <p className="text-lg text-gray-700 mt-2">
            <strong>نوع الخدمة:</strong> {offer.serviceType}
          </p>
          <p className="text-xl font-semibold text-gray-800 mt-2">
            <strong>السعر:</strong> ${offer.price}
          </p>
          <p className="text-xl font-bold text-gray-800 mt-2"><b>الوصف :</b></p>
          <p className="text-gray-600 mt-2 text-lg">{offer.description}</p>

          {/* التقييم */}
          <p className="text-lg text-gray-700 mt-4">
            <strong>التقييم:</strong> {offer.rating} / 5
          </p>

          {/* التوفر */}
          <p className="text-lg text-gray-700 mt-4">
            <strong>التوفر:</strong> {offer.availability ? "متوفر" : "غير متوفر"}
          </p>
        </div>

        {/* نموذج الحجز */}
        {isSubmitted ? (
          <div className="mt-4 text-center text-green-600">
            <h3>شكراً لك على الحجز! سنقوم بإخطار الشريك.</h3>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="mt-6">
            <div className="flex flex-col space-y-4">
              <label className="text-lg text-gray-700">
                أدخل بريدك الإلكتروني أو رقم هاتفك:
                <input
                  type="text"
                  value={contact}
                  onChange={handleContactChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md"
                  placeholder="البريد الإلكتروني أو الهاتف"
                  required
                />
              </label>
              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                حجز هذا العرض
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default OfferDetailPage;
