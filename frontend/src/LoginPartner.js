import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { GoArrowLeft } from 'react-icons/go';
import { auth, googleProvider, facebookProvider, signInWithEmailAndPassword } from './firebase'; // Ensure the import path is correct

const LoginPartner = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert('مرحباً بعودتك، شريك!');
      navigate('/HomepagePartner');
    } catch (error) {
      setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.');
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('مرحباً بعودتك، شريك!');
      navigate('/HomepagePartner');
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء تسجيل الدخول باستخدام جوجل. الرجاء المحاولة مرة أخرى.');
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      alert('مرحباً بعودتك، شريك!');
      navigate('/HomepagePartner');
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء تسجيل الدخول باستخدام فيسبوك. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[rgb(0,176,176)]">
     
      <div className="p-4 max-w-lg w-full backdrop-blur-xl h-full lg:h-3/4 md:h-3/4 sm:h-full lg:w-1/3 bg-transparent rounded-2xl shadow-xl flex justify-center items-center flex-col">
        <h2 className="text-5xl text-white m-4 text-center">تسجيل الدخول كشريك</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="space-y-4 flex flex-col justify-center items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-lg font-semibold bg-white px-8 py-6 rounded-lg w-full mt-4 mx-10 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="البريد الإلكتروني"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-lg font-semibold bg-white px-8 py-6 my-4 w-full mx-10 rounded-lg outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="كلمة المرور"
          />
          <button
            type="submit"
            className="w-full rounded-lg hover:bg-slate-300 transition-all duration-75 bg-white px-4 py-6 my-4"
          >
            تسجيل الدخول
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-2 rounded-lg bg-white hover:bg-slate-300 transition-all duration-75 px-4 py-6"
        >
          تسجيل الدخول باستخدام جوجل
        </button>
        <button
          onClick={handleFacebookLogin}
          className="w-full mt-2 rounded-lg bg-white hover:bg-slate-300 transition-all duration-75 px-4 py-6"
        >
          تسجيل الدخول باستخدام فيسبوك
        </button>
      </div>
    </div>
  );
};

export default LoginPartner;
