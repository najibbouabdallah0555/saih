import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider, db, signInWithEmailAndPassword } from './firebase'; // Firebase config
import { signInWithPopup } from 'firebase/auth'; // Firebase Auth
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Firestore
import { GoArrowLeft } from 'react-icons/go';

const LoginTourist = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists() && userDoc.data().role === 'tourist') {
        // If the user has the 'tourist' role
        alert('مرحباً بعودتك، سائح!');
        navigate('/HomepageTourist'); // Redirect to tourist homepage
      } else if (userDoc.exists() && userDoc.data().role === 'partner') {
        // If the user is a partner, redirect to Unauthorized page
        navigate('/Unauthorized');
      } else {
        navigate('/Unauthorized'); // If the role is not 'tourist' or 'partner'
      }
    } catch (error) {
      setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore, or create a new record
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist in Firestore, create the document and set the role as 'tourist'
        await setDoc(userDocRef, { role: 'tourist', email: user.email });
      } else if (userDoc.data().role === 'partner') {
        // If the user is a partner, redirect to Unauthorized page
        navigate('/Unauthorized');
        return;
      } else if (userDoc.data().role !== 'tourist') {
        // If the user is not a tourist, redirect to Unauthorized page
        navigate('/Unauthorized');
        return;
      }

      // If user is a tourist, redirect to HomepageTourist
      alert('مرحباً، سائح!');
      navigate('/HomepageTourist'); // Redirect to tourist homepage
    } catch (error) {
      setErrorMessage('فشل في تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[rgb(0,176,176)]">
     
      <div className="p-4 max-w-lg w-full backdrop-blur-xl h-full lg:h-3/4 md:h-3/4 sm:h-full lg:w-1/3 bg-transparent rounded-2xl shadow-xl flex justify-center items-center flex-col">
        <h2 className="text-5xl text-white m-4 text-center">تسجيل الدخول كسائح</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="space-y-4 flex flex-col justify-center items-center">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-lg font-semibold bg-white px-8 py-6 rounded-lg w-full mt-4 mx-10 outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="البريد الإلكتروني"
          />
          <input
            type="password"
            id="password"
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
        <div className="mt-4 flex flex-col space-y-4">
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-6"
          >
            تسجيل الدخول باستخدام جوجل
          </button>
          <button
            onClick={() => handleSocialSignIn(facebookProvider)}
            className="w-full rounded-lg bg-blue-800 hover:bg-blue-900 text-white px-4 py-6"
          >
            تسجيل الدخول باستخدام فيسبوك
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginTourist;
