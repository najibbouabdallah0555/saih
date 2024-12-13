import React, { useState } from 'react';
import { db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import Loader from './Loader';

function CreateOffer() {
    const [offerName, setOfferName] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [rating, setRating] = useState(0);
    const [availability, setAvailability] = useState(true); // Assuming available by default
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const offerData = {
                OfferName: offerName,
                serviceType: serviceType,
                state: state,
                country: country,
                price: parseFloat(price),
                description: description,
                image: image,
                rating: parseFloat(rating), // Store as a float
                availability: availability, // Store availability as boolean
            };

            await addDoc(collection(db, 'offers'), offerData);
            alert('تم إنشاء العرض بنجاح!');
            navigate('/OfferManagement');  // Redirect to offer management page after creation
        } catch (error) {
            console.error('خطأ في إنشاء العرض:', error);
            alert('فشل في إنشاء العرض');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div className='flex flex-col justify-center items-center absolute w-full h-screen ' ><Loader /></div>; // Add a spinner if necessary
    }

    return (
        <div className="flex w-full h-screen items-center justify-center bg-gray-200">
            <div className="p-4 max-w-4xl w-full backdrop-blur-xl h-full lg:h-max md:h-max sm:h-full lg:w-max sm:w-max bg-[rgb(0,176,176)] rounded-2xl shadow-xl flex justify-center items-center flex-col">
                <h2 className="backdrop-blur-xl text-3xl text-white m-4 text-center">إنشاء عرض</h2>
                <h5 className="text-xl text-white m-4 text-center">يرجى ملء التفاصيل لإنشاء عرضك</h5>
                
                <form onSubmit={handleCreateOffer} className="space-y-4 flex flex-col justify-center items-center w-full">
                    <input
                        type="text"
                        id="offerName"
                        value={offerName}
                        onChange={(e) => setOfferName(e.target.value)}
                        required
                        className="text-sm font-medium bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="اسم العرض"
                    />

                    {/* خدمة نوع القائمة */}
                    <select
                        id="serviceType"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                    >
                        <option value="">اختر نوع الخدمة</option>
                        <option value="Trip">رحلة</option>
                        <option value="Halal Trip">رحلة حلال</option>
                        <option value="Haj & 3omra">حج وعمرة</option>
                    </select>

                    <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="الولاية"
                    />

                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="الدولة"
                    />

                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="السعر"
                    />

                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="الوصف"
                    />

                    <input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="رابط الصورة"
                    />

                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Math.min(Math.max(e.target.value, 0), 5))} // Ensuring the value is between 0 and 5
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                        placeholder="التقييم (0 - 5)"
                        min="0"
                        max="5"
                        step="0.1"
                    />

                    <select
                        id="availability"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value === 'true')}
                        required
                        className="text-sm font-semibold bg-white px-4 py-4 rounded-lg w-full mt-2 mx-8 outline-none transition-all duration-75 focus:bg-slate-300"
                    >
                        <option value={true}>متاح</option>
                        <option value={false}>غير متاح</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full rounded-lg hover:bg-slate-300 transition-all duration-75 bg-white px-4 py-6 my-4"
                        disabled={loading}
                    >
                        {loading ? "جاري الإنشاء..." : "إنشاء العرض"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateOffer;
