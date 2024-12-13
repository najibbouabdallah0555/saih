import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider, facebookProvider } from './firebase'; // تكوين Firebase
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

function SignUpTourist() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // تحقق مما إذا كان لدى المستخدم بالفعل دور (سائح أو آخر)
  const checkRoleAndSignUp = async (uid, role) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const existingRole = userDoc.data().role;
        if (existingRole === role) {
          setErrorMessage(`أنت مسجل بالفعل كـ ${existingRole}.`);
          return false;
        } else {
          setErrorMessage(`لا يمكنك التسجيل كـ ${role} لأنك بالفعل ${existingRole}.`);
          return false;
        }
      }
      return true;
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء التحقق من دور المستخدم. يرجى المحاولة مرة أخرى.');
      return false;
    }
  };

  // التعامل مع التسجيل باستخدام البريد الإلكتروني وكلمة المرور
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // مسح رسائل الخطأ السابقة
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // التحقق مما إذا كان يمكن للمستخدم التسجيل كـ سائح
      const canSignUp = await checkRoleAndSignUp(user.uid, 'tourist');
      if (!canSignUp) return;

      // إذا لم يكن هناك دور موجود، يتم متابعة إنشاء حساب سائح
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'tourist',
      });

      alert('تم التسجيل بنجاح كـ سائح!');
      navigate('/touristHomepage'); // التوجيه إلى الصفحة الرئيسية للسياح
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // التعامل مع التسجيل عبر Google
  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // التحقق مما إذا كان يمكن للمستخدم التسجيل كـ سائح
      const canSignUp = await checkRoleAndSignUp(user.uid, 'tourist');
      if (!canSignUp) return;

      // إذا لم يكن هناك دور موجود، يتم متابعة إنشاء حساب سائح
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'tourist',
      });

      alert('تم التسجيل بنجاح كـ سائح!');
      navigate('/HomepageTourist'); // التوجيه إلى الصفحة الرئيسية للسياح
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // التعامل مع التسجيل عبر Facebook
  const handleFacebookSignUp = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // التحقق مما إذا كان يمكن للمستخدم التسجيل كـ سائح
      const canSignUp = await checkRoleAndSignUp(user.uid, 'tourist');
      if (!canSignUp) return;

      // إذا لم يكن هناك دور موجود، يتم متابعة إنشاء حساب سائح
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'tourist',
      });

      alert('تم التسجيل بنجاح كـ سائح!');
      navigate('/HomepageTourist'); // التوجيه إلى الصفحة الرئيسية للسياح
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[rgb(0,176,176)]">
    

      <div className="p-4 max-w-lg w-full backdrop-blur-xl h-full lg:h-3/4 md:h-3/4 sm:h-full lg:w-1/3 bg-transparent rounded-2xl shadow-xl flex justify-center items-center flex-col ">
        <h2 className="backdrop-blur-xl text-5xl text-white m-4 text-center">التسجيل كـ سائح</h2>
        <h5 className="text-2xl text-white m-4 text-center">يرجى ملء التفاصيل للمتابعة</h5>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleEmailSignUp} className="space-y-4 flex flex-col justify-center items-center">
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
            التسجيل باستخدام البريد الإلكتروني
          </button>
        </form>
        <h6 className="text-white text-lg text-center my-4">
          لديك حساب بالفعل؟{' '}
          <Link to="/LoginPage" className="text-emerald-300 hover:text-blue-400 font-serif ">
            تسجيل الدخول
          </Link>{' '}
          <br /> أو قم بإنشاء واحد
        </h6>
        <div className="flex flex-row justify-between items-center">
          <button onClick={handleGoogleSignUp} className="m-4 hover:text-black">
            <FaGoogle className="text-4xl text-red-500 hover:text-black" />
          </button>
          <button onClick={handleFacebookSignUp} className="m-4 hover:text-black">
            <FaFacebook className="hover:text-black text-4xl text-sky-500 " />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpTourist;
