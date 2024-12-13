import React from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { FaBuildingUser } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";

const SignUpPage = () => {
    const navigate = useNavigate();
  return (
    <div className="flex w-full h-screen items-center justify-center bg-[rgb(0,176,176)]">
      <Link to={'/'} className='absolute z-10 left-4 top-4 p-4 rounded-full border-black bg-white  hover:shadow-slate-950 hover:bg-slate-300 hover:shadow-2xl duration-75 transition-all'>
        <GoArrowLeft className={"text-3xl"} />
      </Link>
      <div className="p-10 max-w-6xl w-full backdrop-blur-xl h-full lg:h-3/4 md:h-3/4 sm:h-full lg:w-1/3 bg-transparent rounded-2xl shadow-xl flex justify-center items-center flex-col ">
        <h2 className="text-3xl font-bold text-gray-100 mb-6">مرحبًا بك في بوابتنا</h2>
        <p className="text-gray-100 text-2xl mb-8">يرجى اختيار الطريقة التي ترغب في تسجيل الدخول بها:</p>

        <div className="flex flex-row justify-center items-center mt-10">
          {/* زر تسجيل الدخول كعميل */}
          <button
            onClick={() => navigate('/signup-tourist')}
            className=" text-black text-7xl border-2 hover:text-gray-200 p-20 font-semibold rounded-md transition duration-300 flex flex-col justify-center items-center"
          >
            <IoPerson />
            <p className='text-lg'>تسجيل الدخول كعميل</p>
          </button>

          {/* زر تسجيل الدخول كشريك */}
          <button
            onClick={() => navigate('/signup-partner')}
            className="mx-2 text-black hover:text-gray-200 text-7xl border-2 font-semibold p-20 rounded-md transition duration-300 flex flex-col justify-center items-center"
          >
            <FaBuildingUser />
            <p className='text-lg'>التسجيل كشريك</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;
