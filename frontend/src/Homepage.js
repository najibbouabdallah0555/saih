import React, { useState, useEffect, useCallback } from 'react';
import Menu from './menu.js';
import LandingPage from './Landingpage.js';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const Homepage = () => {
  const [offers, setOffers] = useState([]);

  const fetchOffers = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));

      // تعيين العروض الفريدة مباشرة واستخدام Set لتحسين الأداء
      const uniqueOffers = Array.from(
        querySnapshot.docs.reduce((acc, doc) => {
          acc.set(doc.id, { id: doc.id, ...doc.data() });
          return acc;
        }, new Map()).values()
      );

      setOffers(uniqueOffers);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب العروض: ', error.message);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className="min-h-screen transition-colors duration-100 bg-gray-100">
      <Menu />
      <LandingPage offers={offers} /> {/* تمرير العروض إذا كانت LandingPage تستخدمها */}
      <footer className="bg-black text-[rgb(0,176,176)] py-4 text-center">
        <p>&copy; 2024 وكالة السفر الحلال. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Homepage;
