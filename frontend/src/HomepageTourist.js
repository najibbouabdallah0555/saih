import { Link } from 'react-router-dom';
import Menu from './menu';
import LandingPage from './Landingpage';
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Assuming Firebase is properly configured
import { collection, getDocs } from 'firebase/firestore';

const HomepageTourist = () => {

  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // State to track if filtering is applied

  // Fetch offers from Firebase Firestore
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fetch offers from Firestore
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        const offersArray = [];
        querySnapshot.forEach((doc) => {
          offersArray.push({ id: doc.id, ...doc.data() });
        });

        // Remove duplicates by checking the 'id' field
        const uniqueOffers = Array.from(
          new Map(offersArray.map((offer) => [offer.id, offer])).values()
        );

        setOffers(uniqueOffers);
      } catch (error) {
        console.error('Error fetching offers: ', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-100 bg-gray-100 " dir="rtl">
      <Menu />
      <LandingPage />
      <div className="grid md:grid-cols-3 gap-12 px-4 p-20">
              {/* Service 1 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-10 flex justify-center items-center flex-col">
                <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-4">عروض الوكالات</h3>
                <p className="text-gray-700 mb-6">
                  استكشف ما يمكن لوكالتنا تقديمه لك.
                </p>
                <Link to="/OffersPage" className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] mb-4 transition">
                  اذهب إلى صفحة العروض
                </Link>
              </div>

              {/* Service 2 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-10 flex justify-center items-center flex-col">
                <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-4">اكتشف المزيد عن الرحلة</h3>
                <p className="text-gray-700 mb-6">
                  هناك بعض الأشياء التي يمكنك العودة إليها في بعض الحالات.
                </p>
                <Link to="/Explore" className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] mb-4 transition">
                  اذهب إلى صفحة الاستكشاف
                </Link>
              </div>

              {/* Service 3 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-10 flex justify-center items-center flex-col">
                <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-4">عبادات</h3>
                <p className="text-gray-700 mb-6">
                  هنا بعض الأشياء التي يمكن أن تساعدك في رحلتك.
                </p>
                <Link to="/Prayes" className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] mb-4 transition">
                  اذهب إلى صفحة العروض
                </Link>
              </div>
            </div>

      <footer className="bg-black text-[rgb(0,176,176)] py-4 text-center">
        <p>&copy; 2024 وكالة السفر الحلال. جميع الحقوق محفوظة.</p>
      </footer>
  </div>
  );
};

export default HomepageTourist;
