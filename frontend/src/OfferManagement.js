import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import Loader from './Loader';

function OfferManagement() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersSnapshot = await getDocs(collection(db, 'offers'));
        const offersList = offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(offersList);
      } catch (error) {
        console.error('خطأ في جلب العروض:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleDelete = async (offerId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("يجب أن تكون مسجلاً للدخول لحذف العرض.");
        return;
      }

      const offerDocRef = doc(db, 'offers', offerId);
      const offerDoc = await getDoc(offerDocRef);

      if (offerDoc.exists()) {
        const offerData = offerDoc.data();

        if (offerData.userId === user.uid) {
          await deleteDoc(offerDocRef);
          setOffers(offers.filter((offer) => offer.id !== offerId));
          alert('تم حذف العرض بنجاح!');
        } else {
          alert('ليس لديك صلاحية لحذف هذا العرض.');
        }
      } else {
        alert('العرض غير موجود.');
      }
    } catch (error) {
      console.error('خطأ في حذف العرض:', error);
      alert('حدث خطأ في حذف العرض!');
    }
  };

  const handleEdit = (offerId) => {
    navigate(`/EditOffer/${offerId}`);
  };

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Link to={'/HomepagePartner'} className="absolute z-10 left-4 top-4 p-4 rounded-full border-black bg-white hover:shadow-slate-950 hover:bg-slate-300 hover:shadow-2xl duration-75 transition-all">
        <GoArrowLeft className={"text-3xl"} />
      </Link>
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">إدارة العروض</h2>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">اسم الجولة</th>
              <th className="px-6 py-3 text-left">السعر</th>
              <th className="px-6 py-3 text-left">الموقع</th>
              <th className="px-6 py-3 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer.id} className="border-b">
                  <td className="px-6 py-3 text-gray-800">{offer.OfferName}</td>
                  <td className="px-6 py-3 text-gray-600">${offer.price}</td>
                  <td className="px-6 py-3 text-gray-600">{offer.serviceType}, {offer.state}, {offer.country}</td>
                  <td className="px-6 py-3 space-x-4">
                    <button
                      onClick={() => handleEdit(offer.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit className="inline-block" />
                    </button>

                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-6 py-4 text-gray-500">لا توجد عروض حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OfferManagement;
