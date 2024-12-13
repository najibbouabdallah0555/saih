import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Salat = ({ name, time }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
    <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-4">{name}</h3>
    <p className="text-gray-700">الوقت: {time}</p>
  </div>
);

const ServiceCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
    <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-4">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

function LandingPage() {
  const [userExists, setUserExists] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setUserExists(true);
              setUserRole(userDoc.data().userRole);
            } else {
              setUserExists(false);
            }
          } catch (error) {
            console.error('Error checking user existence:', error);
          }
        } else {
          setUserExists(false);
        }
      });
    };

    checkUser();
  }, []);

  const salwat = {
    firstSalat: { name: 'الفجر', time: '05:05' },
    secondSalat: { name: 'الظهر', time: '12:35' },
    thirdSalat: { name: 'العصر', time: '15:04' },
    fourthSalat: { name: 'المغرب', time: '17:58' },
    fifthSalat: { name: 'العشاء', time: '19:15' },
  };

  return (
    <div className="text-black" dir="rtl">
      {/* Hero Section */}
      <header className="bg-background-image bg-cover bg-center text-white h-screen flex justify-center items-center">
        <div className="h-full w-full flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4">مرحبًا بكم في وكالة <span className='bg-gradient-to-r from-[rgb(0,176,176)] text-6xl to-gray-100 bg-clip-text text-transparent'> سائح</span> للسفر الحلال</h1>
          <p className="text-xl mb-6 text-center max-w-2xl">
            استمتع بجمال السفر المخصص لاهتماماتك ومعتقداتك. اكتشف الوجهات التي تقدم خدمات وتجارب حلال.
          </p>
          <a href='#salat' className='bg-teal-600 border-none rounded-full px-10 py-4 hover:shadow-xl hover:bg-white hover:text-[rgb(0,176,176)]  absolute left-20 bottom-20 text-2xl'>سجل الآن</a>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-16 bg-[rgb(0,176,176)]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-100 mb-12">خدمات السفر الحلال لدينا</h2>
          <div className="grid md:grid-cols-3 gap-12 px-4">
            <ServiceCard title="فنادق حلال" description="إقامة في فنادق حلال فاخرة مع مرافق للصلاة ومساحات مفصولة." />
            <ServiceCard title="مطاعم حلال" description="استمتع بمأكولات حلال لذيذة حول العالم مع ضمان الأصالة." />
            <ServiceCard title="جولات إرشادية" description="انضم إلى جولات إرشادية تحترم احتياجاتك الثقافية والدينية مع مسارات مناسبة للمسلمين." />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-[rgb(0,176,176)] mb-8">لماذا تختار وكالة السفر الحلال؟</h2>
          <p className="text-lg text-gray-700 mb-8">
            نحن في وكالتنا ملتزمون بتوفير تجربة سفر آمنة ومريحة وغنية للمسافرين المسلمين حول العالم. إليك لماذا يجب أن تختارنا:
          </p>
          <ul className="list-none space-y-4 text-left max-w-3xl mx-auto">
            <li className="flex items-center">
              <span className="bg-[rgb(0,176,176)] text-white rounded-full p-2 mr-4">✔️</span>
              خبرة في السفر الحلال
            </li>
            <li className="flex items-center">
              <span className="bg-[rgb(0,176,176)] text-white rounded-full p-2 mr-4">✔️</span>
              فنادق ومطاعم حلال مختارة
            </li>
            <li className="flex items-center">
              <span className="bg-[rgb(0,176,176)] text-white rounded-full p-2 mr-4">✔️</span>
              جولات إرشادية مناسبة للمسلمين
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      {!userExists && (
        <section  className="bg-[rgb(0,176,176)] bg-cover bg-center py-16 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">هل أنت مستعد لتخطيط رحلتك؟</h2>
          <p className="text-xl mb-8">شاهد عروضنا اليوم واحجز الآن، دعنا نجعل رحلتك القادمة لا تُنسى.</p>
          <p className="text-xl mb-8">قم بالتسجيل أولاً ودعنا نساعدك في كل شيء.</p>
          <Link
            to="/SignUpPage"
            className="bg-black text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[rgb(0,176,176)] transition-all duration-300"
          >
            سجل الآن
          </Link>
        </section>
      )}

      {/* Salat Times */}
      <section id='salat' className="py-16 bg-[rgb(0,176,176)]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-100 mb-8">مواقيت الصلاة لهذا اليوم</h2>
          <div className="grid md:grid-cols-3 gap-12 px-4">
            {Object.values(salwat).map((salat, index) => (
              <Salat key={index} name={salat.name} time={salat.time} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
