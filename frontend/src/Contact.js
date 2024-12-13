import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock form submission logic
    setSubmitted(true);
    console.log('Form submitted:', formData);

    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="bg-[rgb(0,176,176)] min-h-screen flex flex-col justify-center items-center">
      <div className="bg-gray-100 p-10 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">تواصل معنا</h1>
        <p className="text-center mb-10 text-gray-600">
          هل لديك أي أسئلة أو تحتاج إلى مساعدة؟ لا تتردد في التواصل معنا!
        </p>
        {submitted && (
          <p className="text-green-600 text-center font-semibold mb-4">
            شكرًا لتواصلك معنا! سنقوم بالرد عليك قريبًا.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[rgb(0,176,176)]"
              placeholder="اسمك"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[rgb(0,176,176)]"
              placeholder="بريدك الإلكتروني"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              الرسالة
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[rgb(0,176,176)]"
              rows="5"
              placeholder="رسالتك"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[rgb(0,176,176)] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[rgb(0,146,146)] transition duration-200"
          >
            إرسال
          </button>
        </form>
      </div>
      <footer className="mt-8 text-center text-white">
        <p>&copy; 2024 وكالة السياحة الحلال. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Contact;
