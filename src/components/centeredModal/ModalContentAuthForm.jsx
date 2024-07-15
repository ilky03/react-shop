import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

import { toast } from 'react-toastify';

import Spinner from '../spinner/Spinner';

import useDB from "../../services/useDB";

function ModalContentAuthForm({handleCloseWindow}) {
    
    const [authMode, setAuthMode] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [scroll, setScroll] = useState(0);
    const {auth, create} = useDB();

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

    const isLoginMode = authMode === 'login';

    const handleChangeAuthMode = (e) => {
        isLoginMode ? setAuthMode('registration') : setAuthMode('login');;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        setIsLoading(true);

        if (isLoginMode) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
                const user = userCredential.user;

                if (!user.emailVerified) {
                  await signOut(auth);
                  toast.error('Будь ласка, підтвердіть свою електронну пошту.');
                } else {
                  toast.success('Вхід виконано!');
                  handleCloseWindow();
                }
              } catch (e) {
                toast.error('От халепа... Сталася помилка :(');
              } finally {
                setIsLoading(false);
              }
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                const user = userCredential.user;

                await sendEmailVerification(user);
                if (user) {
                    data.id = user.uid;
                    await create(`users/${user.uid}`, data);
                }
                toast.success('Профіль успішно створений!'); 
                await signOut(auth);
                toast.info('Будь ласка, підтвердіть свою електронну пошту.');
                handleCloseWindow();
            } catch (e) {
                toast.error('От халепа... Сталася помилка :(')
            } finally {
                setIsLoading(false);
            }
        }
    }
    
    return (
        <>
            {isLoading && <div className="modal-spinner" style={{top: `${scroll}px`}}><Spinner /></div>}
            <h2>{isLoginMode ? 'Вхід' : 'Реєстрація'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    {!isLoginMode && 
                        <>
                            <label htmlFor="lastName">Прізвище</label>
                            <input type="text" name="lastName" id="lastName" required />
            
                            <label htmlFor="firstName">Ім'я</label>
                            <input type="text" name="firstName" id="firstName" required />
            
                            <label htmlFor="middleName">По батькові</label>
                            <input type="text" name="middleName" id="middleName" />
                        </>
                    }
                    <label htmlFor="email">Поштова адреса</label>
                    <input type="text" id="email" name="email" required />

                    <label htmlFor="password">Пароль</label>
                    <input type="password" id="password" name="password" minLength={6} required />
{/* 
                    {!isLoginMode &&
                    <>
                        <label htmlFor="password">Повторіть пароль</label>
                        <input type="password" id="password" name="password" minLength={6} required />
                    </>} */}
                    <button>{!isLoginMode ? 'Зареєструватися' : 'Увійти'}</button>
                </div>
            </form>
            <div className="auth-form__mode-toggle">
                <p>{isLoginMode ? 'Новий користувач?' : 'Уже зареєстровані?'}</p>
                <button type="button" onClick={handleChangeAuthMode}>{isLoginMode ? 'Зареєструватися' : 'Увійти'}</button>
            </div>
        </>
    )
}

export default ModalContentAuthForm;