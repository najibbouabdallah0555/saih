import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from './Loader';

function TourSlider() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        const offersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(offersList);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const nextOffer = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return <div className="text-center text-xl"><Loader /></div>;
  }

  return (
    <div className="offer-slider-container h-min w-full p-6">
      {offers.length !== 0 && (
        <div className="slider-content bg-transparent w-full  rounded-lg p-6">
          <h2 className="text-3xl font-semibold w-full h-min text-center mb-4">أفضل العروض لدينا</h2>
          <div className="offer-slide-container relative h-min w-full">
            <div className="offer-slide w-full h-min">
              {/* Clickable Image */}
              <Link to={`/offer/${offers[currentIndex]?.id}`} className='w-full'>
                <img
                  src={offers[currentIndex]?.image}
                  alt={offers[currentIndex]?.OfferName}
                  className="w-full h-[450px] object-cover object-center rounded-lg mb-4"
                />
              </Link>
              <h3 className="text-xl font-bold">{offers[currentIndex]?.OfferName}</h3>
              <p className="text-gray-600">
                {offers[currentIndex]?.serviceType}, {offers[currentIndex]?.state}, {offers[currentIndex]?.country}
              </p>
              <p className="text-gray-700">${offers[currentIndex]?.price}</p>
              <p className="text-gray-500">{offers[currentIndex]?.description}</p>
            </div>
            <div
              className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg cursor-pointer z-10"
              onClick={prevOffer}
            >
              <FaArrowLeft className="text-3xl text-gray-700" />
            </div>
            <div
              className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg cursor-pointer z-10"
              onClick={nextOffer}
            >
              <FaArrowRight className="text-3xl text-gray-700" />
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {offers.map((_, index) => (
                <div
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    currentIndex === index ? 'bg-gray-100' : 'bg-gray-400'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No offers message */}
      {offers.length === 0 && (
        <div className="text-center text-xl text-gray-900 mt-6">
          لا توجد عروض في الوقت الحالي.
        </div>
      )}
    </div>
  );
}

export default TourSlider;
