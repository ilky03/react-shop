import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import useDB from "../../services/useDB";

function ModalContentAuthForm() {
    
    const [authMode, setAuthMode] = useState('login');

    const {auth, create} = useDB();

    const isLoginMode = authMode === 'login';

    const handleChangeAuthMode = (e) => {
        isLoginMode ? setAuthMode('registration') : setAuthMode('login');;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        if (isLoginMode) {
            try {
                await signInWithEmailAndPassword(auth, data.email, data.password);
                console.log('login suck');
            } catch (e) {
                console.log(e.message);
            }
        } else {
            try {
                await createUserWithEmailAndPassword(auth, data.email, data.password);
                const user = auth.currentUser;
                if (user) {
                    await create(`users/${user.uid}`, data);
                }
                console.log('create succ')
            } catch (e) {
                console.log(e.message);
            }
        }
    }
    
    return (
        <>
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

                    {!isLoginMode &&
                    <>
                        <label htmlFor="password">Повторіть пароль</label>
                        <input type="password" id="password" name="password" minLength={6} required />
                    </>}
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