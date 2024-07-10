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
    where
} from "firebase/firestore";


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
            console.error("Error getting document:", error);
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
            console.error("Error creating document:", e);
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
            console.error("Error updating document:", e);
        } finally {
            setIsLoading(false);
        }
    }

    async function makeQuery(url, id) {
        let customQuery;
        if (id) {
            customQuery = query(collection(db, url), where("id", "==", id));
        } else {
            customQuery = query(collection(db, url));
        }
        let querySnapshot;

        try {
            setIsLoading(true);
            querySnapshot = await getDocs(customQuery);
        } catch(e) {
            console.log(e);
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
            console.error("Error deleting document:", e);
        } finally {
            setIsLoading(false);
        }
    }

    function generateID(length = 20) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    return {get, create, update, deleteRecord, makeQuery, generateID, isLoading};
}
