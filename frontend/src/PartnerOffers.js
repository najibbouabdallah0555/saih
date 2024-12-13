import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; // استيراد إعدادات Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import Loader from './Loader';

const PartnerOffers = () => {
  const { partnerId } = useParams(); // استرجاع معرّف الشريك من الرابط
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersQuery = query(collection(db, 'offers'), where('partnerId', '==', partnerId));
        const querySnapshot = await getDocs(offersQuery);
        const offersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(offersData);
      } catch (error) {
        console.error('خطأ في جلب العروض:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [partnerId]);

  if (loading) {
    return <div><Loader/></div>; // إضافة محرك تحميل إذا لزم الأمر
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">العروض من الشريك</h1>
      {offers.length === 0 ? (
        <p className="text-center text-lg">لم يتم العثور على عروض لهذا الشريك.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="block bg-white rounded-lg shadow-lg p-4"
            >
              <h2 className="text-xl font-semibold">{offer.title}</h2>
              <p className="text-gray-700 mt-2">{offer.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerOffers;
