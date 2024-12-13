import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // استيراد db هنا
import { MdLocalOffer } from 'react-icons/md';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // استيراد طرق Firestore
import { FaHome, FaCog, FaUsers } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';

const PartnerDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // جلب دور المستخدم من Firestore
        const fetchUserRole = async () => {
          try {
            const userRef = doc(db, 'users', user.uid); // جلب مستند المستخدم من Firestore
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.role === 'partner') {
                setUserRole('partner');
              } else {
                navigate('/LoginPage'); // إعادة التوجيه إذا لم يكن الشريك
              }
            } else {
              navigate('/LoginPage'); // إعادة التوجيه إذا لم يوجد مستند المستخدم
            }
          } catch (error) {
            console.error('خطأ في جلب دور المستخدم:', error);
            navigate('/LoginPage'); // إعادة التوجيه عند حدوث خطأ
          }
        };
        fetchUserRole();
      } else {
        navigate('/LoginPage'); // إعادة التوجيه إذا لم يتم تسجيل الدخول
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (userRole !== 'partner') {
    return <div>جاري التحميل...</div>; // عرض حالة التحميل أثناء التحقق من الدور
  }

  return (
    <div className="space-y-6">
    {/* قسم العروض */}
    <section className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">العروض</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex justify-center items-center flex-col border border-gray-300 p-6 rounded-lg shadow-md hover:bg-gray-50">
          <Link to="/create-offer">
            <MdLocalOffer className="text-5xl text-blue-500" />
          </Link>
          <p className="mt-4 text-xl font-medium text-gray-700">إنشاء عرض</p>
        </div>
        <div className="flex justify-center items-center flex-col border border-gray-300 p-6 rounded-lg shadow-md hover:bg-gray-50">
          <Link to="/offer-management">
            <MdLocalOffer className="text-5xl text-green-500" />
          </Link>
          <p className="mt-4 text-xl font-medium text-gray-700">إدارة العروض</p>
        </div>
      </div>
    </section>

    {/* قسم التحليلات (مثال) */}
    <section className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">التحليلات</h1>
      {/* أضف الرسوم البيانية أو البيانات هنا */}
    </section>

    {/* قسم الإشعارات (مثال) */}
    <section className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">الإشعارات</h1>
      {/* قائمة الإشعارات */}
    </section>
  </div>
  );
};

export default PartnerDashboard;


export const Sidebar = () => {
  return (
    <div className="bg-white w-64 h-full space-y-6 p-6 flex flex-col">
      <div className="text-2xl font-bold mb-6 flex flex-row justify-between items-center">
      
        <h1>لوحة التحكم</h1>
      </div>
      
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/HomepagePartner" className="flex items-center space-x-2 hover:text-gray-400">
              <FaHome />
              <span>الصفحة الرئيسية</span>
            </Link>
          </li>
          <li>
            <Link to="/PartnerDashboard/CreateOffer" className="flex items-center space-x-2 hover:text-gray-400">
              <FaUsers />
              <span>إنشاء عرض</span>
            </Link>
          </li>
          <li>
            <Link to="/PartnerDashboard/OfferManagement" className="flex items-center space-x-2 hover:text-gray-400">
              <FaCog />
              <span>إدارة العروض</span>
            </Link>
          </li>
          <li>
            <Link to="/PartnerDashboard/ManageRestaurants" className="flex items-center space-x-2 hover:text-gray-400">
              <FaCog />
              <span>إضافة مطعم</span>
            </Link>
          </li>
          <li>
            <Link to="/PartnerDashboard/DisplayandEditRestaurant" className="flex items-center space-x-2 hover:text-gray-400">
              <FaCog />
              <span>عرض وتعديل المطعم</span>
            </Link>
          </li>
        
        </ul>
      </nav>
    </div>
  );
}
