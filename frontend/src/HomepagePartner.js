import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Menu from './menu.js';
import LandingPage from './Landingpage.js';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomepagePartner = () => {
  const [offers, setOffers] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Function to fetch and process offers
  const fetchOffers = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));

      // Deduplicate offers using Map
      const uniqueOffers = Array.from(
        querySnapshot.docs.reduce((acc, doc) => {
          acc.set(doc.id, { id: doc.id, ...doc.data() });
          return acc;
        }, new Map()).values()
      );

      setOffers(uniqueOffers);
    } catch (error) {
      console.error('Error fetching offers:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className="min-h-screen transition-colors duration-100 bg-gray-100" dir="rtl">
      <Menu />
      <LandingPage />
      <div className="grid md:grid-cols-3 gap-12 px-4 py-10" id='offers'>
        {/** Section 1: Agency Offers */}
        <ServiceCard
          title="عروض الوكالات"
          description="اكتشف ما يمكن أن تقدمه وكالتنا لك."
          link="/OffersPage"
          buttonLabel="اذهب إلى صفحة العروض"
        />
        {/** Section 2: Discover More */}
        <ServiceCard
          title="اكتشف المزيد عن الرحلة"
          description="هناك بعض الأشياء التي يمكنك العودة إليها في بعض الحالات."
          link="/Explore"
          buttonLabel="اذهب إلى صفحة الاستكشاف"
        />
        {/** Section 3: Prayers */}
        <ServiceCard
          title="الصلاة"
          description="إليك بعض الأشياء التي يمكن أن تساعدك في رحلتك."
          link="/Prayes"
          buttonLabel="اذهب إلى صفحة العروض"
        />
        {/** Section 4: Partner Dashboard */}
        <ServiceCard
          title="لوحة تحكم الشريك"
          description="شاهد ما يمكنك فعله معنا كشريك."
          link="/PartnerDashboard"
          buttonLabel="اذهب إلى لوحة التحكم"
        />
      </div>
      <footer className="bg-black mt-20 text-[rgb(0,176,176)] py-4 text-center">
        <p>&copy; 2024 وكالة السفر الحلال. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

const ServiceCard = ({ title, description, link, buttonLabel }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
    <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-4">{title}</h3>
    <p className="text-gray-700 mb-6">{description}</p>
    <Link
      to={link}
      className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] mb-4 transition"
    >
      {buttonLabel}
    </Link>
  </div>
);

export default HomepagePartner;
