import React from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { GiAlgeria } from "react-icons/gi";
import { TbWorldShare } from "react-icons/tb";


const Offrechoose= () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[rgb(0,176,176)]">
    
      <div className="p-10 max-w-6xl w-full backdrop-blur-xl h-full lg:h-3/4 md:h-3/4 sm:h-full lg:w-1/3 bg-transparent rounded-2xl shadow-xl flex justify-center items-center flex-col">
        <h2 className="text-3xl font-bold text-gray-100 mb-6">اختر رحلتك</h2>
        <p className="text-gray-100 text-2xl mb-8">هل رحلتك؟</p>

        <div className="flex flex-row justify-center items-center mt-10">
          <button
            onClick={() => navigate('/Ofr')}
            className=" text-black text-7xl border-2 hover:text-gray-200 p-20 font-semibold rounded-md transition duration-300 flex flex-col justify-center items-center"
          >
            <GiAlgeria />
            <p className='text-lg'>داخل الجزائر</p>
          </button>
          <button
            onClick={() => navigate('/Halalbookingredirect')}
            className="mx-2 text-black hover:text-gray-200 text-7xl border-2 font-semibold p-20 rounded-md transition duration-300 flex flex-col justify-center items-center"
          >
            <TbWorldShare />
            <p className='text-lg'>خارج الجزائر</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offrechoose;
