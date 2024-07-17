import { useState } from "react";
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    deleteDoc, 
    updateDoc, 
    getDoc, 
    getDocs, 
    query, 
    collection,
    where,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { toast } from 'react-toastify';

const firebaseConfig = {
    apiKey: "AIzaSyCJbuGgbGs26JGMUeDH5alX-BqX9AUv5Iw",
    authDomain: "shop-3b5b5.firebaseapp.com",
    projectId: "shop-3b5b5",
    storageBucket: "shop-3b5b5.appspot.com",
    messagingSenderId: "258738419970",
    appId: "1:258738419970:web:07f8529e0d782cad1bea1b",
    measurementId: "G-L8J1ZDS2N0"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();
// const UID = 'users/tjlRDGn2watycJT5gysj';
export default function useDB() {
    const [isLoading, setIsLoading] = useState(false);

    async function get(url) {
        let data;
        let path = doc(db, url);
        setIsLoading(true);
        try {
            const response = await getDoc(path)
            if (response.exists()) {
                data = response.data();
            }
        } catch (error) {
            toast.error('От халепа... Сталася помилка :(')
        } finally {
            setIsLoading(false);
        }
        return data;
    }

    async function create(url, data) {
        setIsLoading(true);
        let path = doc(db, url);
        try {
            await setDoc(path, data);
        } catch(e) {
            toast.error('От халепа... Сталася помилка :(')
        } finally {
            setIsLoading(false);
        }
    }

    async function update(url, data) {
        setIsLoading(true);
        let path = doc(db, url);
        try {
            await updateDoc(path, data);
        } catch(e) {
            toast.error('От халепа... Сталася помилка :(')
        } finally {
            setIsLoading(false);
        }
    }

    async function makeQuery(url, id, customName = 'id') {
        let customQuery;
        if (id) {
            customQuery = query(collection(db, url), where(customName, "==", id));
        } else {
            customQuery = query(collection(db, url));
        }
        let querySnapshot;

        try {
            setIsLoading(true);
            querySnapshot = await getDocs(customQuery);
        } catch(e) {
            toast.error('От халепа... Сталася помилка :(')
        } finally {
            setIsLoading(false);
        }
        let data = [];
        querySnapshot.forEach((snap) => data.push(snap.data()));
        return data;
    }

    async function deleteRecord(url) {
        setIsLoading(true);
        let path = doc(db, url);
        try {
            await deleteDoc(path);
        } catch(e) {
            toast.error('От халепа... Сталася помилка :(')
        } finally {
            setIsLoading(false);
        }
    }

    const updateProductRating = async (productId, userId, rating) => {
        const productRef = doc(db, 'products', productId);
    
        try {
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
                const currentData = productSnap.data();
                const currentRatings = currentData.rating || [];
    
                const userRatingIndex = currentRatings.findIndex(item => item.uid === userId);
    
                if (userRatingIndex !== -1) {
                    currentRatings[userRatingIndex].rating = rating;
                } else {
                    currentRatings.push({ uid: userId, rating });
                }
                await updateDoc(productRef, { rating: currentRatings });
                toast.success('Дякуємо за ваш відгук!');
            }
        } catch (e) {
            toast.error('От халепа... Сталася помилка :(');
        }
    };
    

    function generateID(length = 20) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    return {get, create, update, deleteRecord, makeQuery, generateID, updateProductRating, auth, isLoading};
}
