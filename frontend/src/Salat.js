import React from 'react'

const Salat = () => {
    const salwat = {
        firstSalat: { name: 'الفجر', time: '05:05' },
        secondSalat: { name: 'الظهر', time: '12:35' },
        thirdSalat: { name: 'العصر', time: '15:04' },
        fourthSalat: { name: 'المغرب', time: '17:58' },
        fifthSalat: { name: 'العشاء', time: '19:15' },
      };
  return (
    <div>      
        {/* Timing Section */}
        <section className="h-40 bg-gray w-full flex flex-col justify-around items-center">
        <div className="text-xl font-semibold first-letter:text-2xl">
            <h1 className="text-slate-800">Praying Timing</h1>
        </div>
        <div className="flex flex-row justify-around items-center w-full">
            {Object.keys(salwat).map((salatKey, idx) => {
            const salat = salwat[salatKey];
            return (
                <div key={idx} className="flex flex-col items-center text-slate-800">
                <h3 className="text-md font-bold">{salat.time}</h3>
                <h5 className="font-thin text-lg">{salat.name}</h5>
                </div>
            );
            })}
        </div>
        </section>
    </div>
  )
}

export default Salat