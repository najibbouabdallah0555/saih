import React from 'react';

const About = () => {
  const faqs = [
    {
      question: 'ما هي خدمات وكالة السياحة الحلال "سيح"؟',
      answer: 'نقدم خدمات السياحة الحلال بما يشمل تنظيم الرحلات، الجولات الحلال، خدمات العمرة والحج، والإقامة في فنادق تقدم خيارات طعام حلال بالكامل.',
    },
    {
      question: 'هل يتم تقديم الطعام الحلال فقط في جميع الجولات؟',
      answer: 'نعم، جميع خيارات الطعام المقدمة في رحلاتنا معتمدة حلال ومناسبة لجميع المسافرين.',
    },
    {
      question: 'هل تقدمون خدمات مخصصة للأفراد أو العائلات؟',
      answer: 'نعم، نقدم برامج مخصصة للأفراد والعائلات لضمان تلبية كافة احتياجاتهم.',
    },
    {
      question: 'كيف يمكنني حجز رحلة أو جولة مع "سيح"؟',
      answer: 'يمكنك حجز رحلتك عبر موقعنا الإلكتروني أو من خلال التواصل معنا مباشرة عبر صفحة "تواصل معنا".',
    },
    {
      question: 'ما هي الدول التي تغطيها خدماتكم؟',
      answer: 'نغطي وجهات سياحية متنوعة حول العالم، مع تركيز خاص على الوجهات المناسبة للمسافرين المسلمين.',
    },
  ];

  return (
    <div className="bg-[rgb(0,176,176)] min-h-screen flex flex-col justify-center items-center">
      <div className="bg-gray-100 p-10 my-10 rounded-lg shadow-md w-full max-w-5xl ">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">حول وكالة "سائح"</h1>
        <p className="text-center mb-10 text-gray-600">
          وكالة "سيح" هي وجهتك الأولى للسياحة الحلال. نسعى لتوفير تجربة سياحية استثنائية 
          للمسافرين المسلمين حول العالم مع مراعاة القيم والمبادئ الإسلامية في جميع خدماتنا.
        </p>
        <div className="text-lg mb-12">
          <p className="mb-4">
            تأسست "سيح" على رؤية توفير رحلات آمنة وموثوقة ومتوافقة مع الثقافة الإسلامية، حيث نقدم خدمات 
            متكاملة تشمل الإقامة الحلال، الجولات المصممة خصيصًا، وخيارات الطعام الحلال. هدفنا هو خلق ذكريات 
            لا تُنسى لجميع عملائنا.
          </p>
          <p>
            سواء كنت تخطط لرحلة عائلية، مغامرة فردية، أو رحلة روحانية للحج والعمرة، 
            "سيح" هنا لتلبية كل توقعاتك وضمان راحتك وسعادتك.
          </p>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">الأسئلة الشائعة</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-[rgb(0,176,176)] mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="mt-8 text-center text-white">
        <p>&copy; 2024 وكالة السياحة الحلال "سيح". جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default About;
