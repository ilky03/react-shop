import { useEffect, useState } from "react";

import useDB from "../../services/useDB";

import ModalContentForm from "./ModalContentForm";
import ModalContentOrdersList from "./ModalContentOrdersList";
import ModalContentAuthForm from './ModalContentAuthForm';

import './centeredModal.scss';

function ModalContentProfile({handleCloseWindow, type, profileData}) {

    const [orders, setOrders] = useState();
    const { makeQuery } = useDB();

    useEffect(() => {
        makeQuery('orders/').then(data => setOrders(data));
    //eslint-disable-next-line
    }, []);

    const whichBtnClick = type.split('-')[1];

    const renderProfileContent = () => {
        switch(whichBtnClick) {
            case 'cabinet':
                return (
                    <>
                        <h2>Особистий кабінет</h2>
                        <form>
                        <ModalContentForm profileData={profileData} />
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
                        <ModalContentAuthForm />
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
            {renderProfileContent()}
        </>
    )
}

export default ModalContentProfile;
