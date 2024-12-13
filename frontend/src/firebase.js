import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: 'AIzaSyAX6hvGVC03_0TUSDOmgB8bESPwCunC-K4', // Replace with your Firebase credentials
  authDomain: 'siah-5e7d6.firebaseapp.com',
  projectId: 'siah-5e7d6',
  storageBucket: 'siah-5e7d6.firebasestorage.app',
  messagingSenderId: '205208560523',
  appId: '1:205208560523:web:4a3eaf022ec5c91e20c58e',
};

const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth = getAuth(app); // Get the auth instance
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Firebase Storage instance

const googleProvider = new GoogleAuthProvider(); // Google provider
const facebookProvider = new FacebookAuthProvider(); // Facebook provider

// Function to add an offer to Firebase
const addOfferToFirebase = async (offerData) => {
  try {
    // Add offer data to Firestore 'offers' collection
    const docRef = await addDoc(collection(db, 'offers'), offerData);
    console.log('Offer added with ID:', docRef.id);
  } catch (e) {
    console.error('Error creating offer:', e);
  }
};

// Function to fetch offers from Firebase
const getOffers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'offers')); // Get all offers
    const offersList = [];
    querySnapshot.forEach((doc) => {
      offersList.push({ id: doc.id, ...doc.data() });
    });
    return offersList;
  } catch (e) {
    console.error('Error fetching offers: ', e);
    return [];
  }
};

export { auth, googleProvider, facebookProvider, signInWithEmailAndPassword, db, storage, addOfferToFirebase, getOffers };
