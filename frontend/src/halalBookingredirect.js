import React, { useEffect, useState } from 'react';

function HalaBookingRedirect() {
  const [countdown, setCountdown] = useState(5); // عداد تنازلي

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://halabooking.com'; // استبدلها برابط تطبيق HalaBooking
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // تنظيف العداد عند فك التثبيت
  }, []);

  const handleRedirectNow = () => {
    window.location.href = 'https://halabooking.com'; // استبدلها برابط تطبيق HalaBooking
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-teal-400 to-cyan-600 text-white">
      <h1 className="text-5xl font-bold mb-6">إعادة التوجيه إلى HalaBooking</h1>
      <p className="text-xl mb-8 text-center max-w-lg">
        اختبر أفضل خدمة حجز صديقة للحلال لرحلتك القادمة.
        سيتم إعادة توجيهك خلال <span className="font-bold">{countdown}</span> ثانية.
      </p>
      <button
        onClick={handleRedirectNow}
        className="bg-white text-cyan-600 py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300"
      >
        إعادة التوجيه الآن
      </button>
      <div className="mt-8">
        <img
          src="https://via.placeholder.com/400x200.png?text=HalaBooking" // استبدلها بشعار HalaBooking أو صورة ذات صلة
          alt="HalaBooking"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default HalaBookingRedirect;
