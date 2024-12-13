import { db } from './firebase';  // Import your Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

// Function to add an offer to Firestore
export const addOfferToDatabase = async (offerData) => {
  try {
    // Get a reference to the 'offers' collection
    const offersCollectionRef = collection(db, 'offers');
    
    // Add a new document to the collection
    const docRef = await addDoc(offersCollectionRef, offerData);
    console.log("Offer added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding offer: ", e);
  }
};
