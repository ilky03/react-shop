import { useEffect, useState, useContext } from "react";

import { AppContext } from "../context/AppContext";
import {  signOut } from "firebase/auth";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useDB from "../../services/useDB";

import ModalContentForm from "./ModalContentForm";
import ModalContentOrdersList from "./ModalContentOrdersList";
import ModalContentAuthForm from './ModalContentAuthForm';

import Spinner from '../spinner/Spinner';

import './centeredModal.scss';

function ModalContentProfile({handleCloseWindow, type}) {

    const { profileData, setProfileData } = useContext(AppContext);
    const [orders, setOrders] = useState();
    const { makeQuery, update, auth, isLoading } = useDB();
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        if (profileData) {
            makeQuery('orders/', profileData.email, 'email').then(data => setOrders(data));
        }
    //eslint-disable-next-line
    }, [profileData]);

    useEffect(() => {
        const modal = document.querySelector('.modal-content');
        
        if (modal) {
            const handleScroll = () => {
                setScroll(modal.scrollTop);
            };
            
            modal.addEventListener("scroll", handleScroll);
    
            return () => {
                modal.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    const whichBtnClick = type.split('-')[1];

    const handleUpdateProfileData = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log(profileData);
        try {
            await update(`users/${profileData.id}`, data);
            data.email = profileData.email;
            setProfileData(data);
            toast.success('Успішно оновлено');
        } catch(e) {
            console.log(e);
        }
        handleCloseWindow();
    }

    const handleLogout = () => {               
        signOut(auth).then(() => {
            toast.success("Ви вийшли з профілю!");
            setProfileData(null);
            handleCloseWindow();
        }).catch((error) => {
            toast.error('От халепа... Сталася помилка :(')
        });
    }

    const renderProfileContent = () => {
        switch(whichBtnClick) {
            case 'cabinet':
                return (
                    <>
                        <h2>Особистий кабінет</h2>
                        <form onSubmit={handleUpdateProfileData}>
                            <ModalContentForm />
                            <div className="form-group">
                                <button>Зберегти зміни</button>
                            </div>
                        </form>
                    <button className='modal-content__cancel-btn' onClick={handleCloseWindow}>Скасувати</button>
                    </>
                )
            case 'settings':
                return (
                    <>
                        <h2>Налаштування</h2>
                        <button className="modal-content__logout-btn" onClick={handleLogout}>Вийти з профілю</button>
                        <button className='modal-content__cancel-btn' onClick={handleCloseWindow}>Закрити</button>
                    </>
                )
            case 'orders':
                return (
                    <>
                        <h2>Мої замовлення</h2>
                        <ul>
                            {orders && orders.sort((a, b) => b.orderDate - a.orderDate).map((order) => {
                                return (
                                    <ModalContentOrdersList order={order} />
                                )
                            })}
                        </ul>
                        <button className='modal-content__cancel-btn' onClick={handleCloseWindow}>Закрити</button>
                    </>
                )
            case 'login':
                return (
                    <>
                        <ModalContentAuthForm handleCloseWindow={handleCloseWindow} />
                        <button className='modal-content__cancel-btn' onClick={handleCloseWindow}>Закрити</button>
                    </>
                )
            default:
                return (
                    <>
                        <h2>Помилка</h2>
                        <button className='modal-content__cancel-btn' onClick={handleCloseWindow}>Закрити</button>
                    </>
                )
        }
    }
    return (
        <>
            {isLoading && <div className="modal-spinner" style={{top: `${scroll}px`}}><Spinner /></div>}
            {renderProfileContent()}
        </>
    )
}

export default ModalContentProfile;
