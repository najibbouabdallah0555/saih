import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db,storage, googleProvider, facebookProvider } from './firebase'; // Firebase configuration
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


function SignUpPartner() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  // Check if the user is already signed up with a different role
  const checkRoleAndSignUp = async (uid, role) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const existingRole = userDoc.data().role;
        if (existingRole === role) {
          setErrorMessage(`أنت مسجل بالفعل كـ ${existingRole}.`);
          navigate('/HomepagePartner');  // Redirect to home
          return false;
        } else {
          setErrorMessage(`لا يمكنك التسجيل كـ ${role} لأنك مسجل بالفعل كـ ${existingRole}.`);
          return false;
        }
      }
      return true;
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء التحقق من دور المستخدم. يرجى المحاولة مرة أخرى.');
      return false;
    }
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async (userId) => {
    if (!image) return null;

    const imageRef = ref(storage, `users/${userId}/profile.jpg`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };
  // Handle Email Signup
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const canSignUp = await checkRoleAndSignUp(user.uid, 'partner');
      if (!canSignUp) return;

      // If no existing role, proceed to create a partner account
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        businessName,
        role: 'partner',
      });

      alert('تم التسجيل بنجاح كشريك!');
      navigate('/HomepagePartner'); // Redirect to partner homepage
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle Google Signup
  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const canSignUp = await checkRoleAndSignUp(user.uid, 'partner');
      if (!canSignUp) return;

      // If no existing role, proceed to create a partner account
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        businessName,
        role: 'partner',
      });

      alert('تم التسجيل بنجاح كشريك!');
      navigate('/HomepagePartner'); // Redirect to partner homepage
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle Facebook Signup
  const handleFacebookSignUp = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const canSignUp = await checkRoleAndSignUp(user.uid, 'partner');
      if (!canSignUp) return;

      // If no existing role, proceed to create a partner account
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        businessName,
        role: 'partner',
      });

      alert('تم التسجيل بنجاح كشريك!');
      navigate('/HomepagePartner'); // Redirect to partner homepage
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[rgb(0,176,176)]">
      <Link to={'/SignUpPage'} className="absolute z-10 left-4 top-4 p-4 rounded-full border-black bg-white hover:shadow-slate-950 hover:bg-slate-300 hover:shadow-2xl duration-75 transition-all">
        <GoArrowLeft className="text-3xl" />
      </Link>

      <div className="p-10 max-w-xl w-full backdrop-blur-xl h-max lg:h-max lg:my-auto md:h-3/4 sm:h-full lg:w-1/3 bg-transparent rounded-2xl shadow-xl flex justify-center items-center flex-col ">
        <h2 className="backdrop-blur-xl text-5xl text-white m-4 text-center">التسجيل كشريك</h2>
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
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="text-lg font-semibold bg-white px-8 py-6 my-4 w-full mx-10 rounded-lg outline-none transition-all duration-75 focus:bg-slate-300"
            placeholder="اسم العمل"
          />
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="text-lg font-semibold bg-white px-8 py-6 my-4 w-full mx-10 rounded-lg outline-none transition-all duration-75 focus:bg-slate-300"
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
          <Link to="/Login" className="text-emerald-300 hover:text-blue-400 font-serif ">
            تسجيل الدخول
          </Link>{' '}
          <br /> أو أنشئ حسابًا جديدًا
        </h6>
        <div className="flex flex-row justify-between items-center">
          <button onClick={handleGoogleSignUp} className="m-4 hover:text-black">
            <FaGoogle className="text-4xl  text-red-500 hover:text-black" />
          </button>
          <button onClick={handleFacebookSignUp} className="m-4 hover:text-black">
            <FaFacebook className="hover:text-black text-4xl  text-sky-500 " />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPartner;
