import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from './Loader';

function EditOffer() {
  const { id } = useParams(); // Get the offer ID from the URL
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [formData, setFormData] = useState({
    OfferName: '',
    serviceType: '',
    state: '',
    country: '',
    price: '',
    description: '',
    availability: true,
    img: '', // Added img field
    rating: 0, // Added rating field with initial value
  });

  useEffect(() => {
    const fetchOffer = async () => {
      const offerDoc = doc(db, 'offers', id);
      const offerSnapshot = await getDoc(offerDoc);
      if (offerSnapshot.exists()) {
        setOffer(offerSnapshot.data());
        setFormData(offerSnapshot.data()); // Populate the form with current offer data
      } else {
        console.error('Offer not found');
      }
    };

    fetchOffer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const offerDocRef = doc(db, 'offers', id);
    await updateDoc(offerDocRef, formData);
    alert('تم تحديث العرض بنجاح!');
    navigate('/OfferManagement'); // Redirect to offer management page after edit
  };

  if (!offer) {
    return <div><Loader /></div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">تعديل العرض</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Offer Name */}
        <label htmlFor="OfferName" className="block text-lg font-semibold mb-2">اسم العرض</label>
        <input
          type="text"
          name="OfferName"
          value={formData.OfferName}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="اسم العرض"
        />

        {/* serviceType */}
        <label htmlFor="serviceType" className="block text-lg font-semibold mb-2">نوع الخدمة</label>
        <input
          type="text"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="نوع الخدمة"
        />

        {/* State */}
        <label htmlFor="state" className="block text-lg font-semibold mb-2">الولاية</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="الولاية"
        />

        {/* Country */}
        <label htmlFor="country" className="block text-lg font-semibold mb-2">الدولة</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="الدولة"
        />

        {/* Price */}
        <label htmlFor="price" className="block text-lg font-semibold mb-2">السعر</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="السعر"
        />

        {/* Description */}
        <label htmlFor="description" className="block text-lg font-semibold mb-2">الوصف</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="الوصف"
        />

        {/* Availability */}
        <label htmlFor="availability" className="block text-lg font-semibold mb-2">التوفر</label>
        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
        >
          <option value={true}>متاح</option>
          <option value={false}>غير متاح</option>
        </select>

        {/* Image URL */}
        <label htmlFor="img" className="block text-lg font-semibold mb-2">رابط الصورة</label>
        <input
          type="text"
          name="img"
          value={formData.img}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="رابط الصورة"
        />

        {/* Rating */}
        <label htmlFor="rating" className="block text-lg font-semibold mb-2">التقييم (من 0 إلى 5)</label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded"
          placeholder="التقييم"
          min="0"
          max="5"
          step="0.1"  // Allows decimals (e.g., 4.5)
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded">حفظ التغييرات</button>
      </form>
    </div>
  );
}

export default EditOffer;
