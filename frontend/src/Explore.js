import { Link } from 'react-router-dom';
import { FaMonument } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { MdFastfood } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase'; // تأكد من استيراد تكوين Firebase auth و db
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { GoArrowLeft } from 'react-icons/go';
import Loader from './Loader';

const Explore = () => {

    const icons =[(<FaMonument />),(<MdLocalOffer />),(<PiBuildingApartmentFill />),(<MdFastfood />)];

    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // جلب دور المستخدم عند تحميل المكون
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // جلب دور المستخدم من Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const role = userDoc.data().role; // افتراض أن "الدور" مخزن في Firestore
              setUserRole(role); // تعيين حالة الدور
            }
          } catch (error) {
            console.error('خطأ في جلب دور المستخدم:', error);
          }
        }
        setLoading(false); // تعيين التحميل إلى false بمجرد الانتهاء من جلب الدور
      });
  
      // تنظيف عند فك التثبيت
      return () => unsubscribe();
    }, []);
  
    // التعامل مع حالة التحميل
    if (loading) {
      return <div><Loader /></div>; // يمكنك عرض دائرة تحميل أو رسالة
    }
  
    // تعيين مسار الصفحة السابقة بناءً على دور المستخدم
    let previousPage;
    if (userRole === "partner") {
      previousPage = "/HomepagePartner"; // مسار الشريك
    } else if (userRole === "tourist") {
      previousPage = "/HomepageTourist"; // مسار السائح
    } else {
      previousPage = "/"; // المسار الافتراضي إذا لم يكن هناك دور أو كان الدور غير معروف
    }
    
    let Restaurents;
    if(userRole === 'partner'){
      Restaurents = "ManageRestaurents";
    }
    else if(userRole === 'tourist'){
      Restaurents = 'DisplayRestaurents';
    }
    
    const Offers = {
      "1": { "name": "المعالم السياحية", "Link": "TouristAttractions" },
      "2": { "name": "الدلائل السياحية", "Link": "TouristGuide" },
    }

  return (
    <div className="bg-[rgb(0,176,176)] w-full h-screen flex flex-col justify-center items-center">
    

        <h1 className='text-center text-7xl font-bold mb-20 lg:my-20 md:text-gray-700 z-20'>استكشاف</h1>
        <div className='w-full max-w-7xl h-max bg-gray-100 rounded-3xl flex-col flex justify-center mx-10 lg:flex-row md:flex-col sm:flex-col items-center py-10'>
            {Object.keys(Offers).map((offerKey, idx) => {
            const offer = Offers[offerKey];
            const icon = icons[idx]; // الحصول على الرمز المطابق من مصفوفة الأيقونات

            return (
                <div key={idx} className="text-slate-100 p-4 flex justify-between lg:flex-row flex-col md:flex-col sm:flex-col items-center">
                <Link to={`/${offer.Link}`} className="text-md font-bold flex flex-col px-6 py-8 whitespace-nowrap justify-center hover:text-[rgb(0,176,176)] text-gray-900 text-3xl w-min border-2 rounded-3xl items-center">
                    <span className="mb-4 text-7xl">{icon}</span> {/* عرض الرمز */}
                    {offer.name}
                </Link>
                </div>
            );
            })}
        </div>
    </div>
  )
}

export default Explore;
