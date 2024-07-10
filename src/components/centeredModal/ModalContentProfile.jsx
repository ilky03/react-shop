import { useEffect, useState } from "react";

import { format } from 'date-fns';

import useDB from "../../services/useDB";

import ModalContentForm from "./ModalContentForm";

import './centeredModal.scss';

function ModalContentProfile({handleCloseWindow, type, profileData}) {

    const [orders, setOrders] = useState();
    const { makeQuery } = useDB();

    useEffect(() => {
        makeQuery('orders/').then(data => setOrders(data));
    //eslint-disable-next-line
    }, []);

    const whichBtnClick = type.split('-')[1];

    const formatDate = (date) => {
        return format(date, 'dd.MM.yy HH:mm');
      };

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
                                    <li 
                                        key = {order.id} 
                                        className="order"
                                    >
                                        <div className="order__block">
                                            <div className="order__details">
                                                <h3>Основна інформація</h3>
                                                <p className="order__id"><span>Номер замовлення</span><br />#{order.id}</p>
                                                <p><span className='order__status'>Статус</span><br />{order.status}</p>
                                                <p className='order__date'><span>Дата створення</span><br />{formatDate(order.orderDate.toDate())}</p>
                                                {order.ttn && <p><span>ТТН</span><br /><b>{order.ttn}</b></p>}
                                            </div>
                                        </div>
                                        {order.isFastBuy ? 
                                            <div className="order__block">
                                                <h3>Дані отримувача</h3>
                                                <div className="order__details">
                                                    <p><span>Номер телефону</span><br />{order['phone-number']}</p>
                                                </div>
                                            </div> : 
                                            <>
                                                <div className="order__block">
                                                    <h3>Дані отримувача</h3>
                                                    <div className="order__details">
                                                        <p><span>ПІБ</span><br />{order['last-name'] + ' ' + order['first-name'] + ' ' + order['middle-name'] }</p>
                                                        <p><span>Номер телефону</span><br />{order['phone-number']}</p>
                                                    </div>
                                                </div>
                                                <div className="order__block">
                                                    <h3>Деталі доставки</h3>
                                                    <div className="order__details">
                                                        <p><span>Спосіб оплати</span><br /> {order['payment-method'] === 'card' ? 'Карта' : 'Готівка'}</p>
                                                        <p><span>Поштове відділення</span><br /> {order['post_company'] === 'np' ? 'Нова пошта' : "Укрпошта"}</p>
                                                        <p><span>Населений пункт</span><br /> {order['post-address']}</p>
                                                        <p><span>Відділення</span><br /> {order['post-number']}</p>
                                                    </div>
                                                </div>
                                            </>}
                                        <div className="order__block  order__products">
                                            <h3>Деталі замовлення</h3>
                                            <ul className="product-info">
                                                <li><span>Фото</span><span>Товар</span><span>К-сть</span><span>Вартість</span></li>
                                                {order['order'] && order['order'].map(({id, photoUrl, title, amount, price, isDiscount, discPrice, article}) => { 
                                                    return (
                                                        <li key={id} style={{position: "relative"}}>
                                                            <span className='grid-center'><img src={photoUrl} alt={title} /></span>
                                                            <p>{title}</p>
                                                            <p>x{amount}</p>
                                                            <p>{isDiscount ? amount * discPrice : amount * price} ₴</p>
                                                            <p className="order__article">Артикул: {article}</p>
                                                        </li>
                                                    )
                                                })}
                                                <li>
                                                    <span>Сума</span><b>
                                                    {order['order'] && order['order'].reduce((acc, prod) => 
                                                        acc += prod.isDiscount ? 
                                                            prod.discPrice*prod.amount :
                                                            prod.price*prod.amount, 0)} ₴
                                                </b></li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <button className='modal-content__cancel-btn' onClick={handleCloseWindow}>Закрити</button>
                    </>
                )
            case 'login':
                return (
                    <>
                        <h2>Вхід/реєстрація</h2>
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
